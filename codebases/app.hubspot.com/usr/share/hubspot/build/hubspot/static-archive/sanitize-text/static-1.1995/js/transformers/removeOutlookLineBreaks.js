'use es6';

import { secureDocument } from '../sanitizers/SanitizeConfiguration';

var isOutlookEmailWithChildren = function isOutlookEmailWithChildren(node, nodeName) {
  return nodeName === 'p' && node && node.classList && node.classList.contains('MsoNormal') && node.children && node.children.length;
};

var removeNbsp = function removeNbsp(node) {
  var op = secureDocument.createElement('o:p');

  if (node.innerHTML.includes('&nbsp;')) {
    op.innerHTML = node.innerHTML.replace(/&nbsp;/g, '').trim();
    return op;
  }

  return node;
};

var isEmptyBrokenParagraph = function isEmptyBrokenParagraph(node) {
  if (!node || node.tagName.toLowerCase() !== 'o:p') {
    return false;
  } // https://issues.hubspotcentral.com/browse/CRMMAIL-6523
  // "<o:p> &nbsp;SampleText&nbsp; </o:p>" was being detected as an empty broken
  // paragraph and "SampleText" would not render. We have to recreate the
  // "<o:p> SampleText </o:p>" without &nbsp; to check for any other existing text


  var nodeWithoutNbsp = removeNbsp(node);
  return !nodeWithoutNbsp.children.length && nodeWithoutNbsp.innerHTML === '';
};

var isSpanWithBrokenParagraph = function isSpanWithBrokenParagraph(child) {
  return child && child.tagName.toLowerCase() === 'span' && isEmptyBrokenParagraph(child.firstElementChild);
};

export var removeOutlookLineBreaks = function removeOutlookLineBreaks(_ref) {
  var node = _ref.node,
      node_name = _ref.node_name;

  if (!isOutlookEmailWithChildren(node, node_name)) {
    return null;
  }

  var child = node.firstElementChild;

  if (isSpanWithBrokenParagraph(child) && child.childNodes.length > 1) {
    // https://issues.hubspotcentral.com/browse/CRMMAIL-5459
    // the <span> has child content other than the empty, broken paragraph
    // so we need to remove only the empty, broken paragraph "<o:p> &nbsp; </o:p>"
    // Don't use ChildNode.remove() for IE11 support
    child.removeChild(child.firstElementChild);
    return removeOutlookLineBreaks({
      node: node,
      node_name: 'p'
    });
  }

  if (isEmptyBrokenParagraph(child) || isSpanWithBrokenParagraph(child)) {
    // https://issues.hubspotcentral.com/browse/CRMMAIL-3503
    // https://issues.hubspotcentral.com/browse/CRMMAIL-5147
    if (node.childNodes.length > 1) {
      // remove the empty, broken paragraph "<o:p> &nbsp; </o:p>"
      node.removeChild(child); // process the rest of the node in case there are other broken paragraphs to remove

      return removeOutlookLineBreaks({
        node: node,
        node_name: 'p'
      });
    }

    return {
      node: secureDocument.createElement('br')
    };
  }

  var div = secureDocument.createElement('div');
  Object.keys(node.attributes).forEach(function (key) {
    var attribute = node.attributes[key];
    div.setAttribute(attribute.nodeName, attribute.nodeValue);
  }); // https://issues.hubspotcentral.com/browse/CRMMAIL-4310

  div.innerHTML = node.innerHTML.replace(/&nbsp;/g, ' ').trim();
  return {
    node: div
  };
};