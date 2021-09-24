'use es6';

export var addLinkTargetAttribute = function addLinkTargetAttribute(_ref) {
  var node = _ref.node,
      config = _ref.config;

  if (!node || !node.href || node.tagName !== 'A') {
    return null;
  } // https://issues.hubspotcentral.com/browse/MESSAGES-2862


  var shouldOpenLinkInSameTab = node.href.match('(tel|mms|sms|mailto):[0-9]+'); //https://issues.hubspotcentral.com/browse/MESSAGES-5813

  if (node.getAttribute('target') === '_self' && !shouldOpenLinkInSameTab) {
    node.setAttribute('target', '_top');
  }

  var targetValue = shouldOpenLinkInSameTab ? '_self' : node.getAttribute('target');

  if (targetValue) {
    node.setAttribute('target', targetValue);
  }

  return {
    node: node,
    config: config
  };
};