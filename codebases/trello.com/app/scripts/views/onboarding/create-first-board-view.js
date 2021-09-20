// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');
const { Controller } = require('app/scripts/controller');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'onboarding',
);
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const CreateFirstBoardComponent = require('app/scripts/views/onboarding/create-first-board');
const { ErrorBoundary } = require('app/src/components/ErrorBoundary');
const { Feature } = require('app/scripts/debug/constants');

class CreateFirstBoardView extends View {
  static initClass() {
    this.prototype.tagName = 'div';
    this.prototype.className = 'first-board-wrapper';
  }

  render() {
    this.$el.html(
      t.renderable(() => t.div('.first-board-wrapper.js-create-first-board')),
    );

    ReactDOM.render(
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-bizteam',
          feature: Feature.Madlibs,
        }}
      >
        <CreateFirstBoardComponent
          // eslint-disable-next-line react/jsx-no-bind
          onSubmit={(board) => this.createBoard(board)}
        />
      </ErrorBoundary>,
      this.$('.js-create-first-board')[0],
    );

    return this;
  }

  createCollection(inputs, collection, ...rest) {
    const [attrs] = Array.from(rest.slice(0, rest.length - 0));
    return inputs
      .filter((d) => d.name !== '')
      .map(({ name }, index) => {
        return collection.create({
          name,
          pos: index + 1,
          creationMethod: 'assisted',
          ...attrs,
        });
      });
  }

  createBoard(board) {
    const initialData = { name: board.name };
    const requestData = _.extend(
      {
        prefs_permissionLevel: 'private',
        prefs_selfJoin: true,
        prefs_background: 'lime',
        creationMethod: 'assisted',
        defaultLists: false,
      },
      initialData,
    );

    const newBoard = Auth.me().boardList.create(initialData, {
      requestData,
      success: (board) => {
        // this fixes an issue with idBoards not being updated at the time that
        // the board gets rendered and the client thinking the member is not on
        // the board
        let currentBoards, needle;
        if (
          ((needle = board.id),
          !Array.from((currentBoards = Auth.me().get('idBoards'))).includes(
            needle,
          ))
        ) {
          return Auth.me().set('idBoards', currentBoards.concat(board.id));
        }
      },
      error: () => {
        return Alerts.flash(
          'could not create board',
          'error',
          'createBoardError',
        );
      },
    });

    return this.listenTo(this.model.boardList, 'sync', () => {
      const newLists = this.createCollection(board.lists, newBoard.listList);
      return this.listenTo(newLists[0], 'sync', () => {
        const newCards = this.createCollection(
          board.lists[0].cards,
          newLists[0].cardList,
        );
        const checklistInput = board.checkItem;
        if (_.isEmpty(checklistInput)) {
          return this.navigateToNewBoard(newBoard);
        } else {
          return this.listenTo(newCards[0], 'sync', () => {
            const checklist = this.createCollection(
              ['Checklist'],
              newCards[0].checklistList,
              { idCard: newCards[0].id },
            )[0];
            return this.listenTo(checklist, 'sync', () => {
              const checkItem = this.createCollection(
                [{ name: checklistInput }],
                checklist.checkItemList,
              )[0];
              return this.listenTo(checkItem, 'sync', () => {
                // if we navigate before the checklist item is synced, you get this weird experience where the
                // item exists on the card, but not yet in the card preview
                return this.navigateToNewBoard(newBoard);
              });
            });
          });
        }
      });
    });
  }

  navigateToNewBoard(board) {
    Auth.me().dismiss('create-first-board');
    return Controller.displayBoard({
      idBoard: board.id,
      openListComposer: false,
      openCardComposerInFirstList: true,
    }).done();
  }
}

CreateFirstBoardView.initClass();
module.exports = CreateFirstBoardView;
