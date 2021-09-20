/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'board_list',
);
const {
  shouldHandleClick,
} = require('app/scripts/lib/util/should-handle-click');
const { navigate } = require('app/scripts/controller/navigate');

const link = function (t, url, ...args) {
  const { attrs, contents } = t.normalizeArgs(args);
  if (attrs.href != null) {
    throw Error("Can't specify an href on a `link` tag");
  }
  attrs.href = url;

  const oldOnClick = attrs.onClick;
  attrs.onClick = function (e) {
    if (!shouldHandleClick(e)) {
      return;
    }
    e.preventDefault();
    if (typeof oldOnClick === 'function') {
      oldOnClick();
    }
    navigate(url, { trigger: true });
  };

  return t.a(attrs, contents);
};

class BoardlistSectionHeaderLinkComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'BoardlistSectionHeaderLinkComponent';

    this.prototype.render = t.renderable(function () {
      const {
        url,
        iconClass,
        icon,
        titleKey,
        titleText,
        onClick,
        linkClasses,
        count,
      } = this.props;

      const defaultClasses = {
        'boards-page-board-section-header-options-item': true,
      };

      const classes = _.extend(defaultClasses, linkClasses);

      // We deliberately don't use the icon/locale-key overload of t.icon
      // because it inserts a space between the icon and its text, which
      // looks weird since the text will be underlined.
      return link(
        t,
        url,
        {
          class: t.classify(classes),
          onClick,
        },
        () => {
          if (icon) {
            t.span(
              '.boards-page-board-section-header-options-item-icon',
              {
                style: {
                  marginRight: '6px',
                  height: '20px',
                  width: '20px',
                  display: 'inline-block',
                },
              },
              () => {
                t.addElement(React.cloneElement(icon, { size: 'small' }));
              },
            );
          } else {
            t.icon(iconClass, {
              class: 'boards-page-board-section-header-options-item-icon',
            });
          }
          return t.span(
            '.boards-page-board-section-header-options-item-name',
            () => {
              t.format(titleKey);
              if (count != null) {
                t.text(` (${count})`);
              }
              if (titleText) {
                return t.text(`: ${titleText}`);
              }
            },
          );
        },
      );
    });
  }
}

BoardlistSectionHeaderLinkComponent.initClass();
module.exports = BoardlistSectionHeaderLinkComponent;
