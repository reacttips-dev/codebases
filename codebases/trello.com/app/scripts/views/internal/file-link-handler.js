// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { l } = require('app/scripts/lib/localize');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'file_link_handler',
);

class FileLinkComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'FileLinkComponent';
  }

  render() {
    const { url } = this.props;

    return t.render(() =>
      t.div(function () {
        t.p(() => t.format('browsers-prevent-file-links'));
        return t.input('.js-autofocus', {
          type: 'text',
          value: url,
          readOnly: true,
          onFocus(e) {
            e.target.select();
          },
        });
      }),
    );
  }
}

FileLinkComponent.initClass();

module.exports = (linkElem) =>
  PopOver.show({
    elem: linkElem,
    getViewTitle() {
      return l(['view title', 'open file link']);
    },
    reactElement: (
      <FileLinkComponent key="FileLinkComponent" url={linkElem.href} />
    ),
  });
