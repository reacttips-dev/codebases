/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const { Auth } = require('app/scripts/db/auth');
const { Dates } = require('app/scripts/lib/dates');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'canonical_comment',
);
const { l } = require('app/scripts/lib/localize');
const moment = require('moment');
const CanonicalCommentInlineReply = require('app/scripts/views/canonical-detail/canonical-comment-inline-reply');
const CanonicalDetailOverflow = require('app/scripts/views/canonical-detail/canonical-detail-overflow');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const { CanonicalCard } = require('@trello/test-ids');
const ReactionPiles = require('app/scripts/views/reactions/reaction-piles');
const {
  FriendlyLinksRenderer,
  FRIENDLY_LINKS_CONTAINER_CLASS,
} = require('app/gamma/src/components/friendly-links-renderer');

const {
  DismissIcon,
  DetailActions,
  DetailContainer,
  DetailInfo,
  DetailInfoPrimary,
  DetailInfoSecondary,
  DetailInfoUserName,
  CommentText,
  CompleteIcon,
  ClockIcon,
  Header,
  IconButton,
  SendIcon,
  ReactionContainer,
} = require('@atlassian/trello-canonical-components').CanonicalDetail;
const Avatar = require('@atlassian/trello-canonical-components')
  .CanonicalAvatar;
const { featureFlagClient } = require('@trello/feature-flag-client');
const smartLinkInHighlightsEnabled = featureFlagClient.get(
  'smart-link-render-in-highlights',
  false,
);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class CanonicalDetailAvatar extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalDetailAvatar';

    this.prototype.render = t.renderable(function () {
      const {
        actionMemberCreator,
        board,
        dueDate,
        dueSoon,
        isActionMemberCreatorDeleted,
      } = this.props;

      const avatarUrl =
        actionMemberCreator != null
          ? actionMemberCreator.get('avatarUrl')
          : undefined;

      if (dueSoon) {
        return t.div('.canonical-due-soon-icon-container', () => {
          t.div('.text-snippet-icons-container', () => {
            return t.span({ class: 'text-snippet-icon icon-lg icon-clock' });
          });
          return t.span('.text-snippet', { ref: this.setDueDateRef }, () => {
            t.format('due');
            t.text(' ');
            return t.span('.date', { key: dueDate, 'data-date': dueDate });
          });
        });
      } else if (!isActionMemberCreatorDeleted) {
        return t.tag(Avatar, {
          key: actionMemberCreator != null ? actionMemberCreator.id : undefined,
          deactivated:
            __guard__(board.getOrganization(), (x) =>
              x.getMemberType(actionMemberCreator),
            ) === 'deactivated' ||
            __guard__(
              actionMemberCreator != null
                ? actionMemberCreator.attributes
                : undefined,
              (x1) => x1.activityBlocked,
            ),
          img: avatarUrl && [avatarUrl, '30.png'].join('/'),
          img2x: avatarUrl && [avatarUrl, '50.png'].join('/'),
          initials:
            actionMemberCreator != null
              ? actionMemberCreator.get('initials')
              : undefined,
          lightBackground: true,
          size: 32,
        });
      } else {
        return t.span('.icon-lg.icon-member');
      }
    });
  }

  constructor(props) {
    super(props);
    this.setDueDateRef = this.setDueDateRef.bind(this);
  }

  setDueDateRef(ref) {
    this.dueDateRef = ref;

    if (this.dueDateRef) {
      return Dates.update(this.dueDateRef);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.dueDateRef && prevProps.dueDate !== this.props.dueDate) {
      return Dates.update(this.dueDateRef);
    }
  }
}
CanonicalDetailAvatar.initClass();

class CanonicalDetailHeader extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalDetailHeader';

    this.prototype.render = t.renderable(function () {
      const {
        actionMemberCreator,
        board,
        cardId,
        date,
        dueDate,
        dueSoon,
        isActionMemberCreatorDeleted,
        isAddMemberToCard,
        isEdited,
        overflowMenuItems,
        trackOverflowMenuOpens,
      } = this.props;

      const name = !isActionMemberCreatorDeleted
        ? actionMemberCreator != null
          ? actionMemberCreator.get('fullName')
          : undefined
        : l(['action', 'deleted-account']);

      return t.tag(Header, () => {
        t.tag(CanonicalDetailAvatar, {
          actionMemberCreator,
          board,
          dueDate,
          dueSoon,
          isActionMemberCreatorDeleted,
        });

        if (!dueSoon) {
          t.tag(DetailInfo, function () {
            if (isAddMemberToCard) {
              t.tag(DetailInfoPrimary, function () {
                if (Auth.isMe(actionMemberCreator)) {
                  return t.format('you-added-yourself-to-card');
                } else {
                  return t.format('user-added-you-to-card', {
                    actionMemberCreatorName: name,
                  });
                }
              });
            } else {
              t.tag(DetailInfoUserName, () => t.text(name));
            }

            return t.tag(DetailInfoSecondary, function () {
              const dateText = isEdited
                ? `${moment(date).fromNow()} ${t.l('edited')}`
                : moment(date).fromNow();
              return t.text(dateText);
            });
          });
        }

        if (
          (overflowMenuItems != null ? overflowMenuItems.length : undefined) > 0
        ) {
          return t.tag(CanonicalDetailOverflow, {
            cardId,
            menuItems: overflowMenuItems,
            trackOverflowMenuOpens,
          });
        }
      });
    });
  }
}
CanonicalDetailHeader.initClass();

class CanonicalCommentText extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalCommentText';

    this.prototype.render = t.renderable(function () {
      const { commentText, collapseComment } = this.props;
      const { containerHeight, showFullComment } = this.state;

      // using actual DOM container height because you can't just count lines of text
      const isCollapsed =
        collapseComment &&
        containerHeight > this.collapsedCommentHeight &&
        !showFullComment;
      const height =
        containerHeight && collapseComment ? `${containerHeight}px` : 'auto';

      if (commentText) {
        return t.div(() => {
          return t.div(
            '.comment-text-container',
            {
              // setting height here so we can animate height while still having auto height
              style: {
                height: isCollapsed
                  ? `${this.collapsedCommentHeight}px`
                  : height,
              },
              ref: (container) => {
                return (this.container = container);
              },
            },
            () => {
              if (isCollapsed) {
                t.div('.hide-comment-overlay');
                t.div('.show-full-comment-container', () => {
                  return t.a(
                    '.show-full-comment-button',
                    { onClick: this.onShowFullCommentClick },
                    () => t.format('show-full-comment'),
                  );
                });
              }
              if (smartLinkInHighlightsEnabled) {
                return t.tag(
                  CommentText,
                  {
                    className: 'markeddown',
                    style: { margin: '0 8px 16px' },
                  },
                  () => {
                    return t.tag(FriendlyLinksRenderer, () => {
                      return t.div(`.${FRIENDLY_LINKS_CONTAINER_CLASS}`, () => {
                        return t.raw(commentText);
                      });
                    });
                  },
                );
              } else {
                return t.tag(
                  CommentText,
                  {
                    className: 'markeddown',
                    style: { margin: '0 8px -8px' },
                  },
                  () => {
                    return t.raw(commentText);
                  },
                );
              }
            },
          );
        });
      } else {
        return t.div();
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      containerHeight: 0,
      showFullComment: false,
    };

    this.collapsedCommentHeight = 200;
    this.onShowFullCommentClick = this.onShowFullCommentClick.bind(this);
  }

  componentDidMount() {
    if (this.container) {
      return this.setState({ containerHeight: this.container.clientHeight });
    }
  }

  onShowFullCommentClick() {
    const { cardId, currentOrgId, idAction } = this.props;

    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'showFullCommentButton',
      source: getScreenFromUrl(),
      containers: {
        card: {
          id: cardId,
        },
        organization: {
          id: currentOrgId,
        },
      },
      attributes: {
        action: {
          id: idAction,
        },
      },
    });
    return this.setState({ showFullComment: true });
  }
}
CanonicalCommentText.initClass();

class CanonicalReactions extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalReactions';

    this.prototype.render = t.renderable(function () {
      const { canReply, idAction, commentText, reactionList } = this.props;

      if (commentText) {
        return t.tag(ReactionContainer, () => {
          if (reactionList != null) {
            return t.createElement(ReactionPiles, {
              actionId: idAction,
              reactionList,
              canReact: canReply,
              renderReactIconWithBorder: true,
              trackingContext: {
                category: 'home',
                actionId: idAction,
              },
            });
          }
        });
      } else {
        return t.div();
      }
    });
  }
}
CanonicalReactions.initClass();

class CanonicalDetailActions extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalDetailActions';

    this.prototype.render = t.renderable(function () {
      const {
        canDismiss,
        canReply,
        replyFailedStatusCode,
        dueSoon,
        onChangeDueDateClick,
        onCompleteClick,
        onDismissClick,
        onReplyClick,
      } = this.props;

      return t.tag(DetailActions, () => {
        if (canReply && onReplyClick && !replyFailedStatusCode) {
          t.tag(
            IconButton,
            {
              icon: <SendIcon />,
              onClick: onReplyClick,
              className: 'canonical-comment-icon-button',
            },
            () => {
              return t.format('reply');
            },
          );
        }

        if (dueSoon && onCompleteClick) {
          t.tag(
            IconButton,
            {
              icon: <CompleteIcon />,
              onClick: onCompleteClick,
              className: 'canonical-comment-icon-button',
            },
            () => {
              return t.format('complete');
            },
          );
        }

        if (canDismiss && onDismissClick) {
          t.tag(
            IconButton,
            {
              icon: <DismissIcon />,
              onClick: onDismissClick,
              className: 'canonical-comment-icon-button',
              'data-test-class': CanonicalCard.CommentDismissButton,
            },
            () => {
              return t.format('dismiss');
            },
          );
        }

        if (onChangeDueDateClick) {
          return t.tag(
            IconButton,
            {
              icon: <ClockIcon />,
              onClick: onChangeDueDateClick,
              className: 'canonical-comment-icon-button',
            },
            () => {
              return t.format('change-date');
            },
          );
        }
      });
    });
  }
}
CanonicalDetailActions.initClass();

class CanonicalCommentReply extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalCommentReply';

    this.prototype.render = t.renderable(function () {
      const {
        isReplying,
        isWaitingForNetworkResponse,
        hasReplied,
        memberCreator,
        onCancelClick,
        onChangeReplyMessage,
        onDismissClick,
        onSaveClick,
        replyAction,
        replyMessage,
        replyFailedStatusCode,
        setFocusedCard,
      } = this.props;

      if (isReplying || hasReplied || replyFailedStatusCode) {
        return t.tag(CanonicalCommentInlineReply, {
          isReplying,
          isWaitingForNetworkResponse,
          hasReplied,
          memberCreator,
          onCancelClick,
          onChangeReplyMessage,
          onDismissClick,
          onSaveClick,
          replyAction,
          replyMessage,
          replyFailedStatusCode,
          setFocusedCard,
        });
      } else {
        return t.div();
      }
    });
  }
}
CanonicalCommentReply.initClass();

class CanonicalDetail extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalDetail';

    this.prototype.render = t.renderable(function () {
      const {
        actionMemberCreator,
        board,
        canDismiss,
        canReply,
        cardId,
        collapseComment,
        commentText,
        currentOrgId,
        date,
        dueDate,
        dueSoon,
        hasReplied,
        idAction,
        isActionMemberCreatorDeleted,
        isAddMemberToCard,
        isEdited,
        isReplying,
        isWaitingForNetworkResponse,
        memberCreator,
        onCancelClick,
        onChangeDueDateClick,
        onChangeReplyMessage,
        onCompleteClick,
        onDismissClick,
        onSaveClick,
        onReplyClick,
        overflowMenuItems,
        reactionList,
        replyAction,
        replyFailedStatusCode,
        replyMessage,
        setFocusedCard,
        trackOverflowMenuOpens,
      } = this.props;

      return t.div(() => {
        return t.div('.canonical-comment', () => {
          t.tag(DetailContainer, () => {
            t.tag(CanonicalDetailHeader, {
              actionMemberCreator,
              board,
              date,
              cardId,
              dueDate,
              dueSoon,
              isActionMemberCreatorDeleted,
              isAddMemberToCard,
              isEdited,
              overflowMenuItems,
              trackOverflowMenuOpens,
            });

            t.tag(CanonicalCommentText, {
              cardId,
              collapseComment,
              commentText,
              currentOrgId,
              idAction,
            });

            t.tag(CanonicalReactions, {
              canReply,
              idAction,
              commentText,
              reactionList,
            });

            return t.tag(CanonicalDetailActions, {
              canDismiss,
              canReply,
              dueSoon,
              replyFailedStatusCode,
              onChangeDueDateClick,
              onCompleteClick,
              onDismissClick,
              onReplyClick,
            });
          });

          return t.tag(CanonicalCommentReply, {
            isReplying,
            isWaitingForNetworkResponse,
            hasReplied,
            memberCreator,
            onCancelClick,
            onChangeReplyMessage,
            onSaveClick,
            replyAction,
            replyMessage,
            setFocusedCard,
            replyFailedStatusCode,
            onDismissClick,
          });
        });
      });
    });
  }
}
CanonicalDetail.initClass();

module.exports = {
  CanonicalDetail,
  CanonicalDetailHeader,
  CanonicalDetailAvatar,
  CanonicalCommentText,
  CanonicalDetailActions,
  CanonicalCommentReply,
};
