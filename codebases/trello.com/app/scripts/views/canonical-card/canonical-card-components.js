/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const { Dates } = require('app/scripts/lib/dates');
const { getStringForCombinedDateBadge } = require('app/gamma/src/util/dates');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'canonical_card',
);
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const moment = require('moment');
const { HomeTestIds } = require('@trello/test-ids');
const { seesVersionedVariation } = require('@trello/feature-flag-client');
const { LinkWrapper } = require('app/src/components/RouterLink/LinkWrapper');
const { N30, N40 } = require('@trello/colors');

const {
  ArchivedBadge,
  AttachmentsBadge,
  Card,
  CardBadges,
  CardCover,
  CardLabel,
  CardLabels,
  CardLink,
  CardMembers,
  CardTemplateBadge,
  CardTitle,
  CheckboxFieldBadge,
  ChecklistBadge,
  CommentsBadge,
  DateFieldBadge,
  DescriptionBadge,
  DueDateBadge,
  ListFieldBadge,
  NotificationBadge,
  NumberFieldBadge,
  SubscribedBadge,
  TextFieldBadge,
  TrelloAttachmentsBadge,
  VotesBadge,
} = require('@atlassian/trello-canonical-components').CanonicalCard;
const {
  Board,
  BoardAndListName,
  ListNameOnly,
  PlaceholderCard,
  TeamBoardAndListName,
} = require('@atlassian/trello-canonical-components').CanonicalBoardCard;
const Avatar = require('@atlassian/trello-canonical-components')
  .CanonicalAvatar;
const {
  labelColorToColorBlindPattern,
} = require('@atlassian/trello-canonical-components/src/card-front/CardLabel');

const boardAndListNameTitle = function (boardName, listName) {
  let result = `${t.l('board')}: ${boardName}`;
  if (listName != null) {
    result += `, ${t.l('list')}: ${listName}`;
  }
  return result;
};

const boardHeaderColor = function (bottomColor, brightness) {
  if (bottomColor) {
    return bottomColor;
  } else if (brightness === 'dark') {
    return '#333';
  } else {
    return N30;
  }
};

class LoadingCanonicalCard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'LoadingCanonicalCard';

    this.prototype.render = t.renderable(() => t.tag(PlaceholderCard));
  }
}
LoadingCanonicalCard.initClass();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class GenericErrorCanonicalCard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'GenericErrorCanonicalCard';

    this.prototype.render = t.renderable(function () {
      const { errorText } = this.props;

      return t.div('.canonical-card-error', () => {
        return t.tag(Board, { bgColor: N40 }, () => {
          return t.tag(Card, { className: 'canonical-card-error-card' }, () => {
            t.tag(CardCover, {
              bgColor: N30,
              bgSize: 'contain',
              height: 40,
              img: require('resources/images/canonical-card/alert-taco.svg'),
              className: 'error-card-cover',
              width: 38,
            });
            return t.tag(CardTitle, () => {
              return t.format('generic error', { message: errorText });
            });
          });
        });
      });
    });
  }
}
GenericErrorCanonicalCard.initClass();

class UnauthorizedCanonicalCard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'UnauthorizedCanonicalCard';

    this.prototype.render = t.renderable(() =>
      t.div('.canonical-card-error', () => {
        return t.tag(Board, { bgColor: N40 }, () => {
          return t.tag(Card, { className: 'canonical-card-error-card' }, () => {
            t.tag(CardCover, {
              bgColor: N30,
              bgSize: 'contain',
              height: 48,
              img: require('resources/images/canonical-card/bouncer-taco.svg'),
              className: 'unauthorized-card-cover',
            });
            return t.tag(CardTitle, () => {
              return t.format('unauthorized card error');
            });
          });
        });
      }),
    );
  }
}
UnauthorizedCanonicalCard.initClass();

class ConfusedTacoCanonicalCard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'ConfusedTacoCanonicalCard';

    this.prototype.render = t.renderable(function () {
      return t.div('.canonical-card-error', () => {
        return t.tag(Board, { bgColor: N40 }, () => {
          return t.tag(Card, { className: 'canonical-card-error-card' }, () => {
            t.tag(CardCover, {
              bgColor: N30,
              bgSize: 'contain',
              height: 40,
              img: require('resources/images/canonical-card/confused-taco.svg'),
              className: 'error-card-cover',
              width: 38,
            });
            return t.tag(CardTitle, () => {
              return t.format(this.props.error);
            });
          });
        });
      });
    });
  }
}
ConfusedTacoCanonicalCard.initClass();

class NotFoundCanonicalCard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'NotFoundCanonicalCard';

    this.prototype.render = t.renderable(() =>
      t.tag(ConfusedTacoCanonicalCard, { error: 'card not found error' }),
    );
  }
}
NotFoundCanonicalCard.initClass();

class NetworkErrorCanonicalCard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'ServerErrorCanonicalCard';

    this.prototype.render = t.renderable(() =>
      t.tag(ConfusedTacoCanonicalCard, { error: 'network error' }),
    );
  }
}
NetworkErrorCanonicalCard.initClass();

class InvalidCanonicalCard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'InvalidCardCanonicalCard';

    this.prototype.render = t.renderable(() =>
      t.tag(ConfusedTacoCanonicalCard, { error: 'invalid card error' }),
    );
  }
}
InvalidCanonicalCard.initClass();

class CanonicalCard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalCard';

    this.prototype.render = t.renderable(function () {
      let left,
        { list } = this.props;
      const {
        board,
        boardClassName,
        card,
        cardClassName,
        colorBlind,
        labels,
        members,
        numNotifications,
        organization,
        lightBackground,
        showListNameOnly,
        onCardClick,
        onCardMouseEnter,
        onCardMouseLeave,
        wideMode,
      } = this.props;

      const badges = card.get('badges');
      const isArchived = card.get('closed');
      const isTemplate = card.get('isTemplate');
      list = list || card.getList();

      return t.tag(
        Board,
        {
          className: boardClassName,
          bgColor: board.getPref('backgroundColor'),
          bgImage:
            (left = __guard__(
              Util.smallestPreviewBiggerThan(
                board.getPref('backgroundImageScaled'),
                250,
                130,
              ),
              (x) => x.url,
            )) != null
              ? left
              : board.getPref('backgroundImage'),
          headerBgColor: boardHeaderColor(
            board.getPref('backgroundBottomColor'),
            board.getPref('backgroundBrightness'),
          ),
          widthPx: wideMode ? 360 : undefined,
        },
        () => {
          t.tag(
            CardLink,
            {
              href: card.get('url'),
              className: cardClassName,
              onClick: onCardClick,
              onMouseEnter: onCardMouseEnter,
              onMouseLeave: onCardMouseLeave,
              linkComponent: LinkWrapper,
            },
            () => {
              if ((labels != null ? labels.length : undefined) > 0) {
                t.tag(CardLabels, () => {
                  return labels.forEach((label) => {
                    const color = label.get('color');
                    if (color === null) {
                      return;
                    }

                    return t.tag(
                      CardLabel,
                      {
                        color,
                        pattern: colorBlind
                          ? labelColorToColorBlindPattern[color]
                          : null,
                        dataTestClass: 'card-label',
                      },
                      () => {
                        return t.text(label.get('name') || ' ');
                      },
                    );
                  });
                });
              }
              t.tag(
                CardTitle,
                { 'data-test-id': HomeTestIds.CardTitle },
                () => {
                  return t.text(card.get('name'));
                },
              );
              t.tag(CardBadges, () => {
                if (isTemplate) {
                  t.tag(CardTemplateBadge, () =>
                    t.format('card template badge label'),
                  );
                }
                if (numNotifications > 0) {
                  t.tag(NotificationBadge, { numUnread: numNotifications });
                }
                if (badges.subscribed) {
                  t.tag(SubscribedBadge, {
                    dataTestClass: 'badge-card-subscribed-icon',
                  });
                }
                if (badges.votes > 0 && !isTemplate) {
                  t.tag(VotesBadge, { numVotes: badges.votes });
                }
                if ((badges.due || badges.start) && !isTemplate) {
                  t.tag(
                    DueDateBadge,
                    {
                      dueDate: badges.due && new Date(badges.due),
                      isComplete: badges.dueComplete,
                    },
                    () => {
                      const shouldSeeCombinedbadges = seesVersionedVariation(
                        'ecosystem.timeline-version',
                        'stable',
                      );
                      if (shouldSeeCombinedbadges) {
                        return t.text(
                          getStringForCombinedDateBadge(
                            badges.start,
                            badges.due,
                          ),
                        );
                      } else if (badges.due) {
                        return t.text(Dates.toDateString(badges.due));
                      } else if (badges.start) {
                        return t.text(Dates.toDateString(badges.start));
                      }
                    },
                  );
                }
                if (badges.description) {
                  t.tag(DescriptionBadge);
                }
                if (badges.comments > 0) {
                  t.tag(CommentsBadge, { numComments: badges.comments });
                }

                const trelloAttachments = badges.attachmentsByType
                  ? badges.attachmentsByType.trello.board +
                    badges.attachmentsByType.trello.card
                  : 0;

                const attachments = badges.attachments - trelloAttachments;
                if (attachments > 0) {
                  t.tag(AttachmentsBadge, { numAttachments: attachments });
                }
                if (trelloAttachments > 0) {
                  t.tag(TrelloAttachmentsBadge, {
                    numAttachments: trelloAttachments,
                  });
                }
                if (badges.checkItems > 0) {
                  t.tag(ChecklistBadge, {
                    numItems: badges.checkItems,
                    numComplete: badges.checkItemsChecked,
                    checkItemsEarliestDue: badges.checkItemsEarliestDue
                      ? new Date(badges.checkItemsEarliestDue)
                      : null,
                  });
                }
                if (isArchived && !isTemplate) {
                  t.tag(ArchivedBadge, () => {
                    return t.format('archived card badge label');
                  });
                }

                if (board.customFieldList.length > 0) {
                  return board.customFieldList.map(function (field) {
                    let item = card.customFieldItemList.find(
                      (item) => item.get('idCustomField') === field.id,
                    );
                    if (item == null) {
                      return null;
                    }
                    item = item.toJSON();
                    field = field.toJSON();
                    if (field.display && !field.display.cardFront) {
                      return null;
                    }
                    switch (field.type) {
                      case 'checkbox':
                        return t.tag(CheckboxFieldBadge, { field, item });
                      case 'date':
                        return t.tag(DateFieldBadge, { field, item });
                      case 'list':
                        return t.tag(ListFieldBadge, { field, item });
                      case 'number':
                        return t.tag(NumberFieldBadge, { field, item });
                      case 'text':
                        return t.tag(TextFieldBadge, { field, item });
                      default:
                        return null;
                    }
                  });
                }
              });

              if ((members != null ? members.length : undefined) > 0) {
                return t.tag(CardMembers, () => {
                  return (() => {
                    const result = [];
                    for (let i = members.length - 1; i >= 0; i--) {
                      const member = members[i];
                      const avatarUrl = member.get('avatarUrl');
                      result.push(
                        t.tag(Avatar, {
                          deactivated:
                            __guard__(board.getOrganization(), (x1) =>
                              x1.getMemberType(member),
                            ) === 'deactivated' ||
                            __guard__(
                              member != null ? member.attributes : undefined,
                              (x2) => x2.activityBlocked,
                            ),
                          img: avatarUrl && [avatarUrl, '30.png'].join('/'),
                          img2x: avatarUrl && [avatarUrl, '50.png'].join('/'),
                          initials: member.get('initials'),
                          lightBackground: lightBackground
                            ? lightBackground
                            : false,
                        }),
                      );
                    }
                    return result;
                  })();
                });
              }
            },
          );

          if (showListNameOnly) {
            return t.tag(ListNameOnly, {
              listName: list != null ? list.get('name') : undefined,
              title: `${t.l('list')}: ${
                list != null ? list.get('name') : undefined
              }`,
            });
          } else {
            if (organization) {
              return t.tag(TeamBoardAndListName, {
                boardName: board != null ? board.get('name') : undefined,
                boardUrl: board != null ? board.get('url') : undefined,
                listName: list != null ? list.get('name') : undefined,
                teamName:
                  organization != null
                    ? organization.get('displayName')
                    : undefined,
                title: boardAndListNameTitle(
                  board != null ? board.get('name') : undefined,
                  list != null ? list.get('name') : undefined,
                ),
                linkComponent: LinkWrapper,
              });
            } else {
              return t.tag(BoardAndListName, {
                boardName: board != null ? board.get('name') : undefined,
                boardUrl: board != null ? board.get('url') : undefined,
                listName: list != null ? list.get('name') : undefined,
                title: boardAndListNameTitle(
                  board != null ? board.get('name') : undefined,
                  list != null ? list.get('name') : undefined,
                ),
                linkComponent: LinkWrapper,
              });
            }
          }
        },
      );
    });
  }
}
CanonicalCard.initClass();

class MicroCanonicalCard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'MicroCanonicalCard';

    this.prototype.render = t.renderable(function () {
      const { badge, card, labels } = this.props;

      return t.tag(Card, () => {
        t.div('.rbc-cust-event-time.badge', () => {
          return t.text(moment(new Date(card.get('due'))).format('LT'));
        });
        t.tag(CardLabels, () => {
          return _.map(labels, (label) => {
            return t.tag(CardLabel, { color: label.get('color') });
          });
        });
        t.tag(CardTitle, () => {
          return t.text(card.get('name'));
        });
        if (badge != null) {
          return t.span('.rbc-cust-event-badge.badge', () => t.text(badge));
        }
      });
    });
  }
}
MicroCanonicalCard.initClass();

module.exports = {
  CanonicalCard,
  GenericErrorCanonicalCard,
  InvalidCanonicalCard,
  LoadingCanonicalCard,
  MicroCanonicalCard,
  NetworkErrorCanonicalCard,
  NotFoundCanonicalCard,
  UnauthorizedCanonicalCard,
};
