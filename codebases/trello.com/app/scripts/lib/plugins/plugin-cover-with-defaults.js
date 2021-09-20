// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
const _ = require('underscore');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');

module.exports = function (pluginCover) {
  // Expected Shape of pluginCover
  // {
  //   height: Number
  //   url: string
  //   edgeColor?: string
  //   position?: 'cover' | { padding: boolean, align: 'left'|'right'|'center'}
  // }
  const sanitized = {
    edgeColor: 'transparent',
    height: pluginCover.height,
    size: 'contain',
    padding: '0',
    position: 'center',
    stickerHeight: pluginCover.height,
    url: pluginCover.url,
  };
  // allow for sanctioned overrides
  if (pluginValidators.isValidHexColor(pluginCover.edgeColor)) {
    sanitized.edgeColor = pluginCover.edgeColor;
  }
  if (pluginCover.position === 'cover') {
    sanitized.size = 'cover';
  } else if (_.isObject(pluginCover.position)) {
    if (pluginCover.position.padding === true) {
      sanitized.padding = '8px';
      sanitized.stickerHeight += 16;
    }
    if (_.contains(['center', 'left', 'right'], pluginCover.position.align)) {
      sanitized.position = pluginCover.position.align;
    }
  }

  return sanitized;
};
