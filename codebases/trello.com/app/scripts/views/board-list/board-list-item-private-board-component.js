// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  PrivateBoardInfoConnected: PrivateBoardInfo,
} = require('app/src/components/CreateBoard/PrivateBoardInfo.tsx');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'board_list_item_add',
);
const {
  workspaceNavigationState,
  workspaceNavigationHiddenState,
} = require('app/src/components/WorkspaceNavigation');

class BoardListItemPrivateBoard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'BoardListItemPrivateBoard';

    this.prototype.render = t.renderable(function () {
      const { workspaceNavigationExpanded } = this.state;

      return t.li(
        `.boards-page-board-section-list-item.board-limits-private-board-list-item${
          workspaceNavigationExpanded
            ? '.boards-page-board-section-list-item--workspace-nav-expanded'
            : ''
        }`,
        () => {
          return t.div('.board-tile.private-mod', () => {
            t.div('.lock-icon', () => {
              return t.icon('private');
            });
            t.div('.private-board-text', () => {
              return t.format('private-board');
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
          });
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
        <PrivateBoardInfo
          key={1}
          isAtOrOverLimit={org.isAtOrOverFreeBoardLimit()}
          openBoardCount={limit.count}
          orgName={org.get('displayName')}
          orgId={org.get('id')}
          orgProduct={org.get('products')[0]}
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
}

BoardListItemPrivateBoard.initClass();
module.exports = BoardListItemPrivateBoard;
