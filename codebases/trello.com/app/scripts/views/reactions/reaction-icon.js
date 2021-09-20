/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')('reactions');

class ReactionIcon extends React.Component {
  static initClass() {
    this.prototype.displayName = 'ReactionIcon';
    this.prototype.render = t.renderable(function () {
      const { disabled, withBorder, active, onClick } = this.props;

      return t.span(
        {
          class: t.classify({
            'reactions-add': true,
            'is-disabled': disabled,
            'mod-with-border': withBorder,
            'is-active': active,
          }),
          onClick,
        },
        () =>
          t.icon('add-reaction', {
            class: t.classify({ 'reactions-add-icon': true }),
            title: t.l('add-reaction'),
          }),
      );
    });
  }
}

ReactionIcon.initClass();
module.exports = ReactionIcon;
