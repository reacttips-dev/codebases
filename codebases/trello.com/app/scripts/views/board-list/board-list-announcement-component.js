// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  naiveShouldComponentUpdate,
} = require('app/scripts/lib/util/naive-should-component-update');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')();
const TFM = require('app/scripts/lib/markdown/tfm');

class BoardListAnnouncementComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'BoardListAnnouncementComponent';
    this.prototype.render = t.renderable(function () {
      const { icon, message, onClick, onDismiss } = this.props;

      return t.div('.boards-page-announcement-container', { onClick }, () =>
        t.div('.boards-page-announcement', function () {
          t.icon(icon);
          t.text(' ');
          t.raw(TFM.description.formatInline(message));

          return t.div(
            '.boards-page-announcement-dismiss',
            { onClick: onDismiss },
            () => t.icon('close'),
          );
        }),
      );
    });

    this.prototype.shouldComponentUpdate = naiveShouldComponentUpdate;
  }
}

BoardListAnnouncementComponent.initClass();
module.exports = BoardListAnnouncementComponent;
