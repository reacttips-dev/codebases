'use es6'; // https://issues.hubspotcentral.com/browse/CRMMAIL-6967
// Remove unnecessary margins to allow users to see more content in thread view

export var standardizeBlockQuoteStyling = function standardizeBlockQuoteStyling(_ref) {
  var node = _ref.node;

  if (node && node.tagName === 'BLOCKQUOTE') {
    node.style.setProperty('margin', '0px 0px 0px .8ex');
    node.style.setProperty('padding-left', '1ex');
    node.style.setProperty('border-left', '1px solid rgb(204,204,204)');
    return {
      node: node
    };
  }

  return null;
};