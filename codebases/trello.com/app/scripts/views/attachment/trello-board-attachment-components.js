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
  'trello_board_attachment',
);

const {
  CanonicalBoard,
  GenericErrorCanonicalBoard,
  InvalidCanonicalBoard,
  LoadingCanonicalBoard,
  NetworkErrorCanonicalBoard,
  NotFoundCanonicalBoard,
  UnauthorizedCanonicalBoard,
} = require('app/scripts/views/canonical-board/canonical-board-components');

class TrelloBoardAttachmentLoading extends React.Component {
  static initClass() {
    this.prototype.displayName = 'TrelloBoardAttachmentLoading';

    this.prototype.render = t.renderable(() =>
      t.div('.trello-board-attachment-loading', () => {
        return t.div('.trello-attachment-canonical-board', () => {
          return t.tag(LoadingCanonicalBoard);
        });
      }),
    );
  }
}
TrelloBoardAttachmentLoading.initClass();

class TrelloBoardAttachmentGenericError extends React.Component {
  static initClass() {
    this.prototype.displayName = 'TrelloBoardAttachmentGenericError';

    this.prototype.render = t.renderable(function () {
      const { canEdit, errorText, onRemove } = this.props;

      return t.div('.trello-board-attachment-error', () => {
        t.div('.trello-attachment-canonical-board', () => {
          return t.tag(GenericErrorCanonicalBoard, { errorText });
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
TrelloBoardAttachmentGenericError.initClass();

class TrelloBoardAttachmentUnauthorized extends React.Component {
  static initClass() {
    this.prototype.displayName = 'TrelloBoardAttachmentUnauthorized';

    this.prototype.render = t.renderable(function () {
      const { canEdit, errorText, onRemove } = this.props;

      return t.div('.trello-board-attachment-error', () => {
        t.div('.trello-attachment-canonical-board', () => {
          return t.tag(UnauthorizedCanonicalBoard);
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
TrelloBoardAttachmentUnauthorized.initClass();

class TrelloBoardAttachmentSpecificError extends React.Component {
  static initClass() {
    this.prototype.displayName = 'TrelloBoardAttachmentSpecificError';

    this.prototype.render = t.renderable(function () {
      const { canEdit, error, onRemove } = this.props;

      return t.div('.trello-board-attachment-error', () => {
        t.div('.trello-attachment-canonical-board', () => {
          if (error === 'bad request') {
            return t.tag(InvalidCanonicalBoard);
          } else if (error === 'server') {
            return t.tag(NetworkErrorCanonicalBoard);
          } else {
            return t.tag(NotFoundCanonicalBoard);
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
TrelloBoardAttachmentSpecificError.initClass();

class TrelloBoardAttachmentComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'TrelloBoardAttachment';

    this.prototype.render = t.renderable(function () {
      const { board, canRemove, onRemove } = this.props;

      return t.div('.trello-board-attachment', () => {
        t.div('.trello-attachment-canonical-board', () => {
          return t.tag(CanonicalBoard, {
            board,
          });
        });

        if (onRemove && canRemove) {
          return t.a('.remove-trello-attachment', { onClick: onRemove }, () => {
            return t.format('remove');
          });
        }
      });
    });
  }
}
TrelloBoardAttachmentComponent.initClass();

module.exports = {
  TrelloBoardAttachmentComponent,
  TrelloBoardAttachmentGenericError,
  TrelloBoardAttachmentLoading,
  TrelloBoardAttachmentSpecificError,
  TrelloBoardAttachmentUnauthorized,
};
