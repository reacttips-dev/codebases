// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'canonical_board',
);
const { N30 } = require('@trello/colors');

const {
  Board,
  BoardLists,
  BoardName,
  Card,
  ErrorMessage,
  List,
  PlaceholderBoardTile,
} = require('@atlassian/trello-canonical-components').CanonicalBoard;

function __range__(left, right, inclusive) {
  const range = [];
  const ascending = left < right;
  const end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
class LoadingCanonicalBoard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'LoadingCanonicalBoard';

    this.prototype.render = t.renderable(() =>
      t.tag(PlaceholderBoardTile, { numLists: 5 }),
    );
  }
}
LoadingCanonicalBoard.initClass();

class GenericErrorCanonicalBoard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'GenericErrorCanonicalBoard';

    this.prototype.render = t.renderable(function () {
      const { errorText } = this.props;

      return t.div('.canonical-board-error', () => {
        return t.tag(
          Board,
          { className: 'canonical-board-error-alert-taco', hasError: true },
          () => {
            return t.tag(ErrorMessage, () => {
              return t.format('generic error', { message: errorText });
            });
          },
        );
      });
    });
  }
}
GenericErrorCanonicalBoard.initClass();

class CanonicalBoardError extends React.Component {
  static initClass() {
    this.prototype.displayName = 'ConfusedTacoCanonicalBoard';

    this.prototype.render = t.renderable(function () {
      return t.div('.canonical-board-error', () => {
        return t.tag(
          Board,
          {
            className: this.props.className,
            hasError: true,
          },
          () => {
            t.tag(ErrorMessage, () => {
              return t.formatText(this.props.error);
            });
            return t.tag(BoardLists, () => {
              return [3, 1, 3, 2, 1].forEach((c) =>
                t.tag(List, () => _.times(c, () => t.tag(Card))),
              );
            });
          },
        );
      });
    });
  }
}
CanonicalBoardError.initClass();

class NotFoundCanonicalBoard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'NotFoundCanonicalBoard';

    this.prototype.render = t.renderable(() =>
      t.tag(CanonicalBoardError, {
        className: 'canonical-board-error-confused-taco',
        error: 'board not found error',
      }),
    );
  }
}
NotFoundCanonicalBoard.initClass();

class NetworkErrorCanonicalBoard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'NetworkErrorCanonicalBoard';

    this.prototype.render = t.renderable(() =>
      t.tag(CanonicalBoardError, {
        className: 'canonical-board-error-confused-taco',
        error: 'network error',
      }),
    );
  }
}
NetworkErrorCanonicalBoard.initClass();

class InvalidCanonicalBoard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'InvalidCardCanonicalBoard';

    this.prototype.render = t.renderable(() =>
      t.tag(CanonicalBoardError, {
        className: 'canonical-board-error-confused-taco',
        error: 'invalid board error',
      }),
    );
  }
}
InvalidCanonicalBoard.initClass();

class UnauthorizedCanonicalBoard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'UnauthorizedCanonicalBoard';

    this.prototype.render = t.renderable(() =>
      t.tag(CanonicalBoardError, {
        className: 'canonical-board-error-bouncer-taco',
        error: 'unauthorized board error',
      }),
    );
  }
}
UnauthorizedCanonicalBoard.initClass();

class CanonicalBoard extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalBoard';

    this.prototype.render = t.renderable(function () {
      const { board } = this.props;

      let lists = board.listList.slice(0, 5);
      if (lists.length === 0) {
        lists = [{ cardList: { length: 1 } }]; // always show at least one list
      }

      const headerBgColor = board.get('prefs').backgroundTopColor
        ? board.get('prefs').backgroundTopColor
        : board.get('prefs').backgroundBrightness === 'dark'
        ? '#333'
        : N30;

      return t.div(() => {
        return t.div('.canonical-board', () => {
          return t.a(
            '.canonical-board-link',
            { href: board.get('url') },
            () => {
              return t.tag(
                Board,
                {
                  bgColor: board.get('prefs').backgroundColor,
                  bgImage: board.get('prefs').backgroundImage,
                  headerBgColor,
                },
                () => {
                  t.tag(BoardName, () => {
                    return t.text(board.get('name'));
                  });
                  return t.tag(BoardLists, () => {
                    return board.get('structure').map((structure) => {
                      return t.tag(List, () => {
                        return __range__(0, structure, false).map((j) =>
                          t.tag(Card),
                        );
                      });
                    });
                  });
                },
              );
            },
          );
        });
      });
    });
  }
}
CanonicalBoard.initClass();

module.exports = {
  CanonicalBoard,
  GenericErrorCanonicalBoard,
  InvalidCanonicalBoard,
  LoadingCanonicalBoard,
  NetworkErrorCanonicalBoard,
  NotFoundCanonicalBoard,
  UnauthorizedCanonicalBoard,
};
