/* eslint-disable
    default-case,
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
const Browser = require('@trello/browser');
const f = require('effing');
const {
  naiveShouldComponentUpdate,
} = require('app/scripts/lib/util/naive-should-component-update');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'board_list_item',
);
const { featureFlagClient } = require('@trello/feature-flag-client');
const Dotdotdot = require('react-dotdotdot');
const { BoardTemplateBadge } = require('app/src/components/BoardTemplateBadge');
const {
  shouldHandleClick,
} = require('app/scripts/lib/util/should-handle-click');
const { navigate } = require('app/scripts/controller/navigate');
const {
  workspaceNavigationState,
  workspaceNavigationHiddenState,
} = require('app/src/components/WorkspaceNavigation');
const styles = require('./board-list-item-component.less').default;

const isWorkspacePageRedesignEnabled = featureFlagClient.get(
  'teamplates.web.workspace-page-redesign',
  false,
);

const isSafariLeftClick = function (e) {
  return Browser.isSafari() && e.button === 0;
};

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

class BoardListItemComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'BoardListItemComponent';

    this.prototype.render = t.renderable(function () {
      const {
        isStarred,
        background: { color, tiled, brightness },
        relUrl,
        orgname,
        name,
        showOptions,
        id,
        onStarClick,
        badgeComponents,
        tagComponents,
        hidden,
        hasUnseenActivity,
        isDraggable,
        onBoardClick,
        isTemplate,
        addTagComponents,
      } = this.props;
      const { workspaceNavigationExpanded } = this.state;

      const backgroundStyle = this.getBackgroundStyle();

      return t.li(
        {
          class: t.classify({
            hide: hidden,
            'boards-page-board-section-list-item': true,
            'boards-page-board-section-list-item--workspace-nav-expanded': workspaceNavigationExpanded,
            'js-draggable': isDraggable,
          }),
        },
        function () {
          const classes = {
            'board-tile': true,
            tile: tiled,
          };

          if (!color) {
            switch (brightness) {
              case 'unknown':
                classes['mod-unknown-background'] = true;
                break;
              case 'light':
                classes['mod-light-background'] = true;
                break;
            }
          }

          // onMouseDown and onMouseUp are here to prevent
          // Safari's default rendering <a> tags while they're
          // being dragged, which changes them to a gray box
          // containing the href attribute. The author of
          // React-DND has said this cannot be fixed, as it is
          // how Safari implements HTML5. The logic of our
          // workaround, then, is this:
          // If the <a> tag doesn't have an href attr, the image
          // will not change while being dragged. However, we do
          // need each board tile to have an href attr on right-click.
          // So, in non-Safari browsers, we do nothing onMouseDown, but
          // in Safari, if we detect a left click (which may lead into a
          // drag), we remove the href onMouseDown and reset it
          // onMouseUp, which occurs before the click. Dragging, plus
          // left/right click navigation, works everywhere -- and in Safari.
          const onMouseDown = function (e) {
            if (isSafariLeftClick(e)) {
              const boardTileLink = e.currentTarget;
              return boardTileLink.removeAttribute('href');
            }
          };
          const onMouseUp = function (e) {
            const boardTileLink = e.currentTarget;
            return boardTileLink.setAttribute('href', relUrl);
          };

          const onClick = onBoardClick;
          link(
            t,
            relUrl,
            {
              onMouseDown,
              onMouseUp,
              onClick,
              class: t.classify(classes),
              style: backgroundStyle,
            },
            function () {
              t.span('.board-tile-fade');

              const detailClasses = {
                'board-tile-details': true,
                'is-badged': true,
                'is-sub-named': orgname,
              };

              t.div({ class: t.classify(detailClasses) }, function () {
                if (isTemplate) {
                  t.createElement(BoardTemplateBadge);
                }
                t.div(
                  '.board-tile-details-name',
                  { title: name, dir: 'auto' },
                  () => t.tag(Dotdotdot, { clamp: 2 }, () => t.text(name)),
                );

                return t.div('.board-tile-details-sub-container', function () {
                  if (orgname) {
                    t.span(
                      '.board-tile-details-sub-name',
                      { title: orgname, dir: 'auto' },
                      () => t.text(orgname),
                    );
                  }

                  if (showOptions) {
                    return t.span('.board-tile-options', function () {
                      if (hasUnseenActivity) {
                        t.span('.board-tile-options-unread-indicator', {
                          title: t.l('there-is-new-activity-on-this-board'),
                        });
                      }
                      return t.icon('star', {
                        class: t.classify({
                          'is-starred': isStarred,
                          'board-tile-options-star-icon': true,
                        }),
                        title: t.l(
                          'click-to-star-this-board-it-will-show-up-at-top-of-your-boards-list',
                        ),
                        onClick(e) {
                          e.preventDefault();
                          e.stopPropagation();
                          // Suppress the underlying event as well, to prevent
                          // this click from bubbling to the global click
                          // handler
                          e.nativeEvent?.stopImmediatePropagation();
                          return onStarClick(id);
                        },
                      });
                    });
                  }
                });
              });

              return t.span('.board-tile-badges', () =>
                badgeComponents.forEach(f(t, 'addElement')),
              );
            },
          );

          if (isWorkspacePageRedesignEnabled) {
            t.div(`.${styles.boardTagsContainer}.u-clearfix`, () => {
              if (tagComponents.length > 0) {
                t.div(`.${styles.boardTags}`, () => {
                  return tagComponents.forEach(f(t, 'addElement'));
                });
              }
              if (addTagComponents?.length > 0) {
                t.div(`.${styles.boardAddTags}`, () => {
                  return addTagComponents.forEach(f(t, 'addElement'));
                });
              }
            });
          } else {
            return t.div(`.${styles.boardTagsOldContainer}.u-clearfix`, () =>
              tagComponents.forEach(f(t, 'addElement')),
            );
          }
        },
      );
    });

    this.prototype.shouldComponentUpdate = naiveShouldComponentUpdate;
  }

  constructor(props) {
    super(props);

    this.getBackgroundStyle = this.getBackgroundStyle.bind(this);
    this.state = {
      workspaceNavigationExpanded:
        workspaceNavigationState.value.enabled &&
        !workspaceNavigationHiddenState.value.hidden &&
        workspaceNavigationState.value.expanded,
    };
  }

  componentDidMount() {
    const updateWorkspaceNavigationExpanded = () => {
      this.setState({
        workspaceNavigationExpanded:
          workspaceNavigationState.value.enabled &&
          !workspaceNavigationHiddenState.value.hidden &&
          workspaceNavigationState.value.expanded,
      });
    };
    this.unsubscribeFromWorkspaceNavigationState = workspaceNavigationState.subscribe(
      updateWorkspaceNavigationExpanded,
    );
    this.unsubscribeFromWorkspaceNavigationHiddenState = workspaceNavigationHiddenState.subscribe(
      updateWorkspaceNavigationExpanded,
    );
  }

  componentWillUnmount() {
    this.unsubscribeFromWorkspaceNavigationState();
    this.unsubscribeFromWorkspaceNavigationHiddenState();
  }

  getBackgroundStyle() {
    const {
      background: { color, image },
    } = this.props;

    if (color) {
      return { backgroundColor: color };
    } else {
      return { backgroundImage: t.urlify(image) };
    }
  }
}

BoardListItemComponent.initClass();
module.exports = BoardListItemComponent;
