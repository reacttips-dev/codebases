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
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')();

class CanonicalDetailOverflowMenu extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalDetailOverflowMenu';

    this.prototype.render = t.renderable(function () {
      const { menuItems } = this.props;

      if ((menuItems != null ? menuItems.length : undefined) > 0) {
        return t.ul('.pop-over-list', () =>
          menuItems.forEach(({ name, onClick }, index) => {
            return t.li({ key: index }, () =>
              t.a({ onClick }, () => t.text(name)),
            );
          }),
        );
      }
    });
  }
}

CanonicalDetailOverflowMenu.initClass();
module.exports = CanonicalDetailOverflowMenu;
