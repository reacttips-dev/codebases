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
const $ = require('jquery');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'canonical_comment',
);
const { Controller } = require('app/scripts/controller');
const TFM = require('app/scripts/lib/markdown/tfm');
const { isForceSubmitEvent } = require('@trello/keybindings');
const Avatar = require('@atlassian/trello-canonical-components')
  .CanonicalAvatar;
const {
  ButtonLink,
  Icon,
  ReplyActions,
  ReplyColumnAvatar,
  ReplyColumnContent,
  ReplyColumns,
  ReplyContainer,
  ReplyLink,
  ReplySentText,
  ReplyTextarea,
  ForwardIcon,
} = require('@atlassian/trello-canonical-components').CanonicalDetail;

class CanonicalCommentInlineReply extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalCommentInlineReply';

    this.prototype.render = t.renderable(function () {
      const {
        memberCreator,
        onSaveClick,
        onCancelClick,
        onChangeReplyMessage,
        onDismissClick,
        replyAction,
        replyMessage,
        replyFailedStatusCode,
        isReplying,
        isWaitingForNetworkResponse,
        hasReplied,
        setFocusedCard,
      } = this.props;

      const { sentAnimationComplete } = this.state;

      const avatarUrl =
        memberCreator != null ? memberCreator.get('avatarUrl') : undefined;

      return t.tag(ReplyContainer, () => {
        if (isReplying) {
          t.tag(ReplyColumns, { key: 'reply-textarea' }, () => {
            t.tag(ReplyColumnAvatar, () => {
              return t.tag(Avatar, {
                lightBackground: true,
                key: memberCreator != null ? memberCreator.id : undefined,
                deactivated:
                  memberCreator != null
                    ? memberCreator.get('isDeactivated')
                    : undefined,
                img: avatarUrl && [avatarUrl, '30.png'].join('/'),
                img2x: avatarUrl && [avatarUrl, '50.png'].join('/'),
                initials:
                  memberCreator != null
                    ? memberCreator.get('initials')
                    : undefined,
              });
            });
            return t.tag(ReplyColumnContent, () => {
              t.tag(ReplyTextarea, {
                value: replyMessage,
                onChange: onChangeReplyMessage,
                className: 'canonical-reply-text-area js-text',
                onFocus: setFocusedCard,
                onKeyDown: this.onKeyDown,
              });
              if (!replyFailedStatusCode) {
                if (!isWaitingForNetworkResponse) {
                  return t.tag(ReplyActions, () => {
                    t.tag(
                      ButtonLink,
                      {
                        disabled: !replyMessage,
                        onClick: onSaveClick,
                        className: 'canonical-reply-button-link',
                      },
                      () => {
                        return t.format('save');
                      },
                    );
                    return t.tag(
                      ButtonLink,
                      {
                        onClick: onCancelClick,
                        className: 'canonical-reply-button-link',
                      },
                      () => {
                        return t.format('cancel');
                      },
                    );
                  });
                } else {
                  return t.span(
                    { class: t.classify({ 'sending-spinner': true }) },
                    () => t.format('sending-ellipsis'),
                  );
                }
              }
            });
          });
        } else if (hasReplied) {
          if (sentAnimationComplete && replyAction) {
            t.tag(
              ReplyLink,
              {
                key: 'reply-link',
                href: replyAction.id
                  ? Controller.getActionUrl(replyAction)
                  : null,
              },
              () => {
                return t.tag(ReplyColumns, { centered: 'true' }, () => {
                  t.tag(
                    ReplyColumnAvatar,
                    {
                      className: 'canonical-reply-sent-avatar',
                    },
                    () => {
                      return t.tag(Avatar, {
                        lightBackground: true,
                        size: 24,
                        key:
                          memberCreator != null ? memberCreator.id : undefined,
                        deactivated:
                          memberCreator != null
                            ? memberCreator.get('isDeactivated')
                            : undefined,
                        img: avatarUrl && [avatarUrl, '30.png'].join('/'),
                        img2x: avatarUrl && [avatarUrl, '50.png'].join('/'),
                        initials:
                          memberCreator != null
                            ? memberCreator.get('initials')
                            : undefined,
                      });
                    },
                  );
                  t.tag(ReplyColumnContent, () => {
                    return t.tag(ReplySentText, () => {
                      return t.text(
                        TFM.comments.text(replyAction.get('data').text).output,
                      );
                    });
                  });
                  return t.tag(
                    Icon,
                    {
                      height: 16,
                      width: 16,
                      className: 'canonical-reply-link-icon',
                    },
                    () => {
                      return t.tag(ForwardIcon);
                    },
                  );
                });
              },
            );
          } else {
            t.tag(
              ReplyColumns,
              {
                key: 'reply-sent',
                centered: true,
              },
              () => {
                return t.tag(ReplyColumnContent, () => {
                  return t.tag(ReplySentText, { centered: true }, () => {
                    return t.format('reply-sent');
                  });
                });
              },
            );
          }
        }
        if (replyFailedStatusCode) {
          return t.tag(ReplyContainer, () => {
            return t.tag(
              ReplyColumns,
              {
                key: 'card-not-found',
                centered: true,
              },
              () => {
                return t.tag(ReplyColumnContent, () => {
                  return t.tag(
                    ReplySentText,
                    {
                      centered: true,
                    },
                    () => {
                      t.format(
                        replyFailedStatusCode === 404
                          ? 'not-found'
                          : 'not-found-generic',
                      );
                      if (replyFailedStatusCode === 404) {
                        return t.tag(ReplyActions, () => {
                          return t.tag(
                            ButtonLink,
                            {
                              onClick: onDismissClick,
                              className: 'canonical-reply-button-link',
                            },
                            () => {
                              return t.format('got-it-dismiss');
                            },
                          );
                        });
                      }
                    },
                  );
                });
              },
            );
          });
        }
      });
    });
  }

  constructor(props) {
    super(props);

    this.state = { sentAnimationComplete: false };

    this.sentAnimationTimeout = null;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.changeReplyMessage = this.changeReplyMessage.bind(this);
  }

  componentDidMount() {
    return $('.js-text').on('mutated', this.changeReplyMessage);
  }

  componentWillUnmount() {
    if (this.sentAnimationTimeout != null) {
      clearTimeout(this.sentAnimationTimeout);
    }

    return $('.js-text').off('mutated', this.changeReplyMessage);
  }

  componentDidUpdate(prevProps) {
    if (this.props.hasReplied !== prevProps.hasReplied) {
      if (this.sentAnimationTimeout != null) {
        clearTimeout(this.sentAnimationTimeout);
      }

      return (this.sentAnimationTimeout = setTimeout(() => {
        return this.setState({ sentAnimationComplete: this.props.hasReplied });
      }, 2000));
    }
  }

  changeReplyMessage(event) {
    return this.props.onChangeReplyMessage(event);
  }

  onKeyDown(e) {
    const { onSaveClick } = this.props;
    if (isForceSubmitEvent(e)) {
      return onSaveClick();
    }
  }
}

CanonicalCommentInlineReply.initClass();
module.exports = CanonicalCommentInlineReply;
