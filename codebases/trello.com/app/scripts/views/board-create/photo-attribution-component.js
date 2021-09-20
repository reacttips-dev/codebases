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
// Using `board_menu_vis` here to share strings from old template
const t = require('app/scripts/views/internal/recup-with-helpers')();
const { unsplashClient } = require('@trello/unsplash');

class PhotoAttributionComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'PhotoAttributionComponent';

    this.prototype.render = t.renderable(function () {
      const { user, size } = this.props;

      const text = user.name;

      const classNames = ['.photo-attribution-component'];
      if (size != null) {
        classNames.push(`.${size}`);
      }

      return t.div(classNames.join(''), () =>
        t.a(
          {
            class: 'photo-attribution-component-attribution-link',
            href: unsplashClient.appendAttribution(user.links.html),
            target: '_blank',
            title: text,
            onClick(e) {
              return e.stopPropagation();
            },
          },
          () => t.text(text),
        ),
      );
    });
  }
}

PhotoAttributionComponent.initClass();
module.exports = PhotoAttributionComponent;
