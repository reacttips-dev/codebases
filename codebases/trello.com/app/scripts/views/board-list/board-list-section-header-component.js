// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { logoDomain } = require('@trello/config');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'board_list',
);
const {
  WorkspaceDefaultLogo,
} = require('app/src/components/WorkspaceLogo/WorkspaceDefaultLogo');

class BoardListSectionHeaderComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'BoardListSectionHeaderComponent';
    this.prototype.render = t.renderable(function () {
      const {
        logoHash,
        title,
        iconClass,
        smallIconClass,
        smallIconTitleKey,
        linkElements,
      } = this.props;
      const { showPNG, showDefaultLogo } = this.state;
      const logoExt = showPNG ? 'png' : 'gif';

      return t.div('.boards-page-board-section-header', () => {
        t.div('.boards-page-board-section-header-icon', () => {
          if (logoHash && !showDefaultLogo) {
            return t.img({
              class: 'boards-page-board-section-header-icon-image',
              src: `${logoDomain}/${logoHash}/30.${logoExt}`,
              srcSet: `${logoDomain}/${logoHash}/30.${logoExt} 1x, ${logoDomain}/${logoHash}/170.${logoExt} 2x`,
              alt: `${title} logo`,
              onError: () => {
                showPNG
                  ? this.setState({ showPNG: false })
                  : this.setState({ showDefaultLogo: true });
              },
            });
          } else if (iconClass) {
            return t.span({ class: `icon-lg icon-${iconClass}` });
          } else {
            return t.div(() => {
              t.addElement(
                <WorkspaceDefaultLogo
                  name={title}
                  className={
                    'boards-page-board-section-header-icon-default-image'
                  }
                />,
              );
            });
          }
        });

        t.h3('.boards-page-board-section-header-name', () => t.text(title));

        if (smallIconClass) {
          t.span('.boards-page-board-section-header-small-icon', () =>
            t.icon(smallIconClass, { title: t.l(smallIconTitleKey) }),
          );
        }

        if (linkElements) {
          return t.div('.boards-page-board-section-header-options', () =>
            Array.from(linkElements).map((link) => t.addElement(link)),
          );
        }
      });
    });
  }
  constructor(props) {
    super(props);
    this.state = { showPNG: true, showDefaultLogo: false };
  }
}

BoardListSectionHeaderComponent.initClass();
module.exports = BoardListSectionHeaderComponent;
