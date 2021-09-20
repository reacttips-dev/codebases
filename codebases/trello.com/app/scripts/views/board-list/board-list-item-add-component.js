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
const {
  FreeBoardLimitInfoConnected: FreeBoardLimitInfo,
} = require('app/src/components/CreateBoard/FreeBoardLimitInfo');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'board_list_item_add',
);
const isDesktop = require('@trello/browser').isDesktop();
const { localizeCount } = require('app/scripts/lib/localize-count');
const {
  BoardTileUpsellConnected: BoardTileUpsell,
} = require('app/src/components/UpgradePathAudit/BoardTileUpsell');
const { CreateBoardTestIds } = require('@trello/test-ids');
const {
  workspaceNavigationState,
  workspaceNavigationHiddenState,
} = require('app/src/components/WorkspaceNavigation');

class BoardListItemAddComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'BoardListItemAddComponent';

    this.prototype.render = t.renderable(function () {
      let boardsOver,
        boardsRemaining,
        showBoardsOver,
        showBoardsRemaining,
        showCreateBoardPrompt;
      const { newBoard, preloadData, org } = this.props;
      const { workspaceNavigationExpanded } = this.state;

      if (!(org != null ? org.isPremium() : undefined)) {
        preloadData();
        boardsRemaining =
          org != null ? org.getFreeBoardsRemaining() : undefined;
        showBoardsRemaining =
          !isDesktop &&
          (org != null ? org.isCloseToFreeBoardLimit() : undefined);
        boardsOver = (org != null ? org.getFreeBoardsOver() : undefined) || 0;
        showBoardsOver = boardsOver > 0;
        showCreateBoardPrompt =
          org &&
          !(org != null ? org.isGrandfatheredBoardLimit() : undefined) &&
          !isDesktop &&
          boardsRemaining === 0;
      }

      return t.li(
        `.boards-page-board-section-list-item${
          workspaceNavigationExpanded
            ? '.boards-page-board-section-list-item--workspace-nav-expanded'
            : ''
        }`,
        { 'data-test-id': CreateBoardTestIds.CreateBoardTile },
        () => {
          if (showCreateBoardPrompt) {
            return t.createElement(BoardTileUpsell, {
              orgId: this.props.org.id,
            });
          } else {
            return t.div(
              '.board-tile.mod-add',
              { onMouseOver: preloadData, onClick: newBoard },
              () => {
                t.p(() => t.format('create-new-board'));
                if (showBoardsRemaining) {
                  t.p('.remaining', () => {
                    t.format('count-remaining', { boardsRemaining });
                    if (showBoardsOver) {
                      return t.span('.over-limit-text', () => {
                        t.text(' | ');
                        return t.span(
                          '.boards-over-limit',
                          {
                            onMouseEnter: this.handleOnMouseEnter(this.textRef),
                            onMouseLeave: this.handleOnMouseLeave,
                            ref: this.textRef,
                          },
                          () =>
                            t.a(() =>
                              t.text(localizeCount('boards-over', boardsOver)),
                            ),
                        );
                      });
                    }
                  });
                  return t.div(
                    '.question-icon',
                    {
                      onMouseEnter: this.handleOnMouseEnter(this.questionRef),
                      onMouseLeave: this.handleOnMouseLeave,
                      ref: this.questionRef,
                    },
                    () => {
                      return t.icon('help');
                    },
                  );
                }
              },
            );
          }
        },
      );
    });
  }
  constructor(props) {
    super(props);

    this.questionRef = React.createRef();
    this.textRef = React.createRef();

    this.hidePopOver = this.hidePopOver.bind(this);
    this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this);
    this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this);
    this.promptClick = this.promptClick.bind(this);
    this.state = {
      currentRef: null,
      isActive: false,
      showPlanSelection: false,
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

  handleOnMouseEnter(currentRef) {
    return (e) => {
      const { org } = this.props;
      this.setState({ isActive: true });
      const limit = org.getFreeBoardLimit();

      if (currentRef) {
        this.setState({ currentRef });
      } else {
        ({ currentRef } = this.state);
      }
      const textComponent = (
        <FreeBoardLimitInfo
          key={1}
          isLimitOverridden={org.isFreeBoardLimitOverridden()}
          isAtOrOverLimit={org.isAtOrOverFreeBoardLimit()}
          isDesktop={isDesktop}
          openBoardCount={limit.count}
          orgName={org.get('displayName')}
          teamName={org.get('name')}
          orgId={org.id}
          upgradeUrl={org.getBillingUrl()}
          onMouseEnter={this.handleOnMouseEnter(currentRef)}
          onMouseLeave={this.handleOnMouseLeave}
        />
      );

      return PopOver.show({
        elem: currentRef.current,
        maxWidth: '242',
        hideHeader: true,
        reactElement: textComponent,
      });
    };
  }

  handleOnMouseLeave() {
    this.setState({
      isActive: false,
    });
    return setTimeout(this.hidePopOver, 500);
  }

  hidePopOver() {
    if (!this.state.isActive) {
      return PopOver.hide();
    }
  }

  promptClick() {
    this.setState({ showPlanSelection: true });
    return this.props.ctaOnClick();
  }
}

BoardListItemAddComponent.initClass();
module.exports = BoardListItemAddComponent;
