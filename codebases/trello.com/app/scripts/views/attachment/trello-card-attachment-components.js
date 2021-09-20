/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Dates } = require('app/scripts/lib/dates');
const React = require('react');
const _ = require('underscore');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'trello_card_attachment',
);

const {
  CanonicalCard,
  GenericErrorCanonicalCard,
  InvalidCanonicalCard,
  LoadingCanonicalCard,
  NetworkErrorCanonicalCard,
  NotFoundCanonicalCard,
  UnauthorizedCanonicalCard,
} = require('app/scripts/views/canonical-card/canonical-card-components');
const { Auth } = require('app/scripts/db/auth');

class TrelloCardAttachmentLoading extends React.Component {
  static initClass() {
    this.prototype.displayName = 'TrelloCardAttachmentLoading';

    this.prototype.render = t.renderable(() =>
      t.div('.trello-card-attachment-loading', () => {
        return t.div('.trello-attachment-canonical-card', () => {
          return t.tag(LoadingCanonicalCard);
        });
      }),
    );
  }
}
TrelloCardAttachmentLoading.initClass();

class TrelloCardAttachmentGenericError extends React.Component {
  static initClass() {
    this.prototype.displayName = 'TrelloCardAttachmentGenericError';

    this.prototype.render = t.renderable(function () {
      const { canEdit, errorText, onRemove } = this.props;

      return t.div('.trello-card-attachment-error', () => {
        t.div('.trello-attachment-canonical-card', () => {
          return t.tag(GenericErrorCanonicalCard, { errorText });
        });

        if (onRemove && canEdit) {
          return t.a('.remove-trello-attachment', { onClick: onRemove }, () => {
            return t.format('remove');
          });
        }
      });
    });
  }
}
TrelloCardAttachmentGenericError.initClass();

class TrelloCardAttachmentUnauthorized extends React.Component {
  static initClass() {
    this.prototype.displayName = 'TrelloCardAttachmentUnauthorized';

    this.prototype.render = t.renderable(function () {
      const { canEdit, onRemove } = this.props;

      return t.div('.trello-card-attachment-error', () => {
        t.div('.trello-attachment-canonical-card', () => {
          return t.tag(UnauthorizedCanonicalCard);
        });

        if (onRemove && canEdit) {
          return t.a('.remove-trello-attachment', { onClick: onRemove }, () => {
            return t.format('remove');
          });
        }
      });
    });
  }
}
TrelloCardAttachmentUnauthorized.initClass();

class TrelloCardAttachmentSpecificError extends React.Component {
  static initClass() {
    this.prototype.displayName = 'TrelloCardAttachmentSpecificError';

    this.prototype.render = t.renderable(function () {
      const { canEdit, error, onRemove } = this.props;

      return t.div('.trello-card-attachment-error', () => {
        t.div('.trello-attachment-canonical-card', () => {
          if (error === 'bad request') {
            return t.tag(InvalidCanonicalCard);
          } else if (error === 'server') {
            return t.tag(NetworkErrorCanonicalCard);
          } else {
            return t.tag(NotFoundCanonicalCard);
          }
        });

        if (onRemove && canEdit) {
          return t.a('.remove-trello-attachment', { onClick: onRemove }, () => {
            return t.format('remove');
          });
        }
      });
    });
  }
}
TrelloCardAttachmentSpecificError.initClass();

class TrelloCardAttachmentComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'TrelloCardAttachment';

    this.prototype.render = t.renderable(function () {
      const {
        board,
        canRemove,
        canLink,
        canUnarchive,
        card,
        isLinked,
        isTemplate,
        labels,
        list,
        members,
        numNotifications,
        onLink,
        onRemove,
        onUnarchive,
      } = this.props;

      const isArchived = card.get('closed');
      const colorBlind = Auth.isLoggedIn() && Auth.me().get('prefs').colorBlind;

      return t.div('.trello-card-attachment', () => {
        t.div('.trello-attachment-canonical-card', () => {
          return t.tag(CanonicalCard, {
            board,
            card,
            colorBlind,
            labels,
            list,
            members,
            numNotifications,
          });
        });

        if (canRemove) {
          t.a('.remove-trello-attachment', { onClick: onRemove }, () => {
            return t.format('remove');
          });
        }

        if (isArchived && canUnarchive && !isTemplate) {
          t.a('.unarchive-trello-card', { onClick: onUnarchive }, () => {
            t.span('.icon-sm.icon-archive');
            return t.format('unarchive card');
          });
        }

        if (!isArchived && !isLinked && canLink) {
          return t.a('.link-trello-card', { onClick: onLink }, () => {
            return t.format('connect-ellipsis');
          });
        }
      });
    });
  }
}
TrelloCardAttachmentComponent.initClass();

module.exports = {
  TrelloCardAttachmentComponent,
  TrelloCardAttachmentGenericError,
  TrelloCardAttachmentLoading,
  TrelloCardAttachmentSpecificError,
  TrelloCardAttachmentUnauthorized,
};
