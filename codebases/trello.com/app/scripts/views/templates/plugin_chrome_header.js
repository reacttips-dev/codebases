/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'plugin_chrome',
);

// based on https://stackoverflow.com/a/3943023
const useLightText = function (color) {
  const [cR, cG, cB] = Array.from(
    color.match(/[0-9a-f]{2}/gi).map(function (hex) {
      const component = parseInt(hex, 16) / 255;
      if (component <= 0.03928) {
        return component / 12.92;
      } else {
        return Math.pow((component + 0.055) / 1.055, 2.4);
      }
    }),
  );

  const luminance = 0.2126 * cR + 0.7152 * cG + 0.0722 * cB;
  return luminance <= 0.4623475;
};

const renderAction = function (action) {
  const clickable =
    _.isFunction(action.callback) ||
    pluginValidators.isValidUrlForIframe(action.url);
  const target = pluginValidators.isValidUrlForIframe(action.url)
    ? action.url
    : '#';
  const anchorProps = {
    class: t.classify({ inactive: !clickable }),
    'data-index': action.index,
    href: target,
    rel: 'noreferrer nofollow noopener',
    target,
    title: action.alt,
  };
  return t.a('.plugin-chrome-header-action', anchorProps, () =>
    t.img('.plugin-action-icon', { height: '16', src: action.icon }),
  );
};

module.exports = t.renderable(function (content) {
  let { accentColor } = content;
  const { title, actions } = content;
  if (content.type !== 'iframe') {
    return;
  }
  if (accentColor == null || !/^#[a-fA-F0-9]{6}$/.test(accentColor)) {
    accentColor = '#EDEFF0';
  }

  const validActions = _.chain(actions)
    .filter((a) => pluginValidators.isValidUrlForImage(a.icon))
    .map((a) => _.extend(a, { index: actions.indexOf(a) }))
    .groupBy('position')
    .value();

  let leftActions = validActions.left?.slice(0, 3) || [];
  const rightActions = validActions.right?.slice(0, 1) || [];

  if (rightActions.length === 1) {
    leftActions = leftActions.slice(0, 2);
  }

  return t.div(
    '.plugin-chrome-header',
    { style: `background-color: ${accentColor};` },
    function () {
      t.div('.plugin-chrome-header-left-actions', () =>
        leftActions.map(renderAction),
      );
      t.span(
        '.plugin-chrome-title',
        { class: t.classify({ light: useLightText(accentColor) }) },
        () => t.text(title),
      );
      return t.div('.plugin-chrome-header-right-actions', function () {
        rightActions.map(renderAction);
        return t.a(
          '.plugin-chrome-close-button.icon-lg.icon-close.js-close-plugin-chrome',
          {
            class: t.classify({ light: useLightText(accentColor) }),
            href: '#',
          },
        );
      });
    },
  );
});
