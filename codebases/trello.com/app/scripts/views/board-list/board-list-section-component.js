// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const {
  UpgradeSmartComponentConnected: UpgradeSmartComponent,
} = require('app/src/components/UpgradePrompts/UpgradeSmartComponent');
const { TeamTemplatePicker } = require('app/src/components/TemplatePicker');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'board_list',
);
const _ = require('underscore');
const { dontUpsell } = require('@trello/browser');
const { UnsplashTracker } = require('@trello/unsplash');
const {
  ClosedBoardsButtonLazyWrapped: ClosedBoardsButton,
} = require('app/src/components/ClosedBoardsButton/ClosedBoardsButtonLazyWrapped');

class BoardListSectionComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'BoardListSectionComponent';

    this.prototype.render = t.renderable(function () {
      const {
        items,
        header,
        noSidebarMod,
        createNewItem,
        showCreateNewItemFirst,
        showAd,
        privateBoardTiles,
        topBanner,
        bottomBanner,
        canShowTeamTemplatePicker,
        orgId,
      } = this.props;
      const boardCount = items.length;
      const displayedItems = this.getDisplayableItems();

      const lessActiveCount = boardCount - displayedItems.length;

      const classes = t.classify({
        'boards-page-board-section': !showAd,
        'mod-no-sidebar': noSidebarMod,
      });

      return t.div({ class: classes }, () => {
        if (header) {
          t.addElement(header);
        }

        if (topBanner) {
          t.div('.boards-page-top-banner', () => {
            return t.addElement(topBanner);
          });
        }

        if (showAd && !dontUpsell()) {
          t.div('.boards-page-layout', () => {
            t.div('.boards-page-layout-sidebar', () => {
              return t.div('.boards-page-ad-section', () => {
                return t.addElement(
                  <UpgradeSmartComponent
                    orgId={this.props.orgId}
                    promptId="teamBoardsScreenPromptFull"
                  />,
                );
              });
            });
            return t.div('.boards-page-layout-list', () => {
              if (canShowTeamTemplatePicker) {
                t.addElement(<TeamTemplatePicker orgId={orgId} />);
              }
              t.ul('.boards-page-board-section-list', () => {
                if (createNewItem && showCreateNewItemFirst) {
                  t.addElement(createNewItem);
                }
                for (const item of Array.from(displayedItems)) {
                  t.addElement(item);
                }
                if (privateBoardTiles) {
                  t.addElement(privateBoardTiles);
                }
                if (createNewItem && !showCreateNewItemFirst) {
                  t.addElement(createNewItem);
                }
              });
              return t.div(
                '.boards-page-closed-boards-button-container',
                () => {
                  return t.createElement(ClosedBoardsButton, {
                    orgId,
                    analyticsSource: 'workspaceBoardsScreen',
                  });
                },
              );
            });
          });
        } else {
          t.div(() => {
            if (canShowTeamTemplatePicker) {
              t.addElement(<TeamTemplatePicker orgId={orgId} />);
            }
            return t.ul('.boards-page-board-section-list', function () {
              if (createNewItem && showCreateNewItemFirst) {
                t.addElement(createNewItem);
              }
              for (const item of Array.from(displayedItems)) {
                t.addElement(item);
              }
              if (privateBoardTiles) {
                t.addElement(privateBoardTiles);
              }
              if (createNewItem && !showCreateNewItemFirst) {
                t.addElement(createNewItem);
              }
            });
          });
        }

        if (bottomBanner) {
          t.div('.boards-page-bottom-banner', () => {
            return t.addElement(bottomBanner);
          });
        }

        const onShowAllClick = () => {
          return this.setState({ collapsed: false });
        };

        if (displayedItems.length < items.length) {
          return t.b(
            onShowAllClick,
            '.boards-page-show-all-boards.quiet-button',
            () =>
              t.format('show-less-active-boards-count', { lessActiveCount }),
          );
        }
      });
    });
  }
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
    };
  }

  componentDidMount() {
    return this.trackUnsplashViews();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.items, prevProps.items)) {
      return this.trackUnsplashViews();
    }
  }

  trackUnsplashViews() {
    const backgrounds = this.getDisplayableItems();

    const backgroundImages = backgrounds.map(
      (background) => background.props.background.image,
    );
    const backgroundImagesFiltered = backgroundImages.filter((bg) => !!bg);
    if (backgroundImagesFiltered.length) {
      return UnsplashTracker.trackOncePerInterval(backgroundImagesFiltered);
    }
  }

  getDisplayableItems() {
    const { items, mayBeSorted } = this.props;
    const { collapsed } = this.state;
    const displayableItems = mayBeSorted
      ? _.chain(items)
          .sortBy((item) => -item.props.dateLastActivity)
          .filter(
            (item, index) =>
              !collapsed || index <= 10 || !item.props.isLessActive,
          )
          .sortBy((item) => item.props.name.toLowerCase())
          .value()
      : items;
    return displayableItems;
  }
}

BoardListSectionComponent.initClass();
module.exports = BoardListSectionComponent;
