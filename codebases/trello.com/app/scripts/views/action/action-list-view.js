/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { ActionView } = require('app/scripts/views/action/action-view');
const CommentActionView = require('app/scripts/views/action/comment-action-view');
const { Dates } = require('app/scripts/lib/dates');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const moment = require('moment');
const { featureFlagClient } = require('@trello/feature-flag-client');

const same = (model) => (cancel) =>
  function (a, b) {
    const isSameModel = model in a && model in b && a[model].id === b[model].id;
    if (isSameModel) {
      return cancel(a, b);
    } else {
      return [false, false];
    }
  };

const sameCard = same('card');
const sameBoard = same('board');

const dup = (a) => [a, a];

const doubleOr = function (...args) {
  const [a, b] = Array.from(args[0]),
    [c, d] = Array.from(args[1]);
  return [a || c, b || d];
};

const has = function (keypath, obj) {
  if (obj == null) {
    return false;
  }
  if (keypath.length === 0) {
    return true;
  }
  const [head, ...tail] = Array.from(keypath);
  return has(tail, obj[head]);
};

const have = (keypath, ...objs) => _.all(objs, (obj) => has(keypath, obj));
const cancelingPairs = [
  {
    a: 'removeMemberFromCard',
    b: 'addMemberToCard',
    cancel: sameCard((a, b) => dup(a.idMember === b.idMember)),
  },
  {
    a: 'deleteAttachmentFromCard',
    b: 'addAttachmentToCard',
    cancel: sameCard((a, b) => dup(a.attachment.id === b.attachment.id)),
  },
  {
    a: 'updateCheckItemStateOnCard',
    b: 'updateCheckItemStateOnCard',
    cancel: sameCard((a, b) => dup(a.checkItem.id === b.checkItem.id)),
  },
  {
    a: 'updateCard',
    b: 'updateCard',
    cancel: sameCard((a, b) =>
      dup(
        'listAfter' in a &&
          'listBefore' in b &&
          a.listAfter.id === b.listBefore.id,
      ),
    ),
  },
  {
    a: 'addChecklistToCard',
    b: 'removeChecklistFromCard',
    cancel: sameCard((a, b) => dup(a.checklist.id === b.checklist.id)),
  },
  {
    a: 'updateBoard',
    b: 'updateBoard',
    cancel: sameBoard((a, b) => [
      have(['board', 'prefs', 'background'], a, b),
      false,
    ]),
  },
];

const shouldCancel = (a, b) =>
  cancelingPairs.reduce(
    function (val, pair) {
      if (a.type !== pair.a || b.type !== pair.b) {
        return val;
      } else {
        return doubleOr(val, pair.cancel(a, b));
      }
    },
    [false, false],
  );
const removeCanceled = function (actions) {
  if (actions.length === 1) {
    return actions;
  }

  const canceled = {};
  const iterable = actions.slice(0, -1);
  for (let ixA = 0; ixA < iterable.length; ixA++) {
    const actionA = iterable[ixA];
    const dataA = actionA.toJSON();
    const dataB = actions[ixA + 1].toJSON();
    _.extend(dataA, dataA.data);
    _.extend(dataB, dataB.data);

    if (
      dataA.idMemberCreator === dataB.idMemberCreator &&
      moment(dataA.date).diff(dataB.date, 'minutes') < 5 &&
      !canceled[dataA.id] &&
      !canceled[dataB.id]
    ) {
      const [cancelA, cancelB] = Array.from(shouldCancel(dataA, dataB));
      if (cancelA) {
        canceled[dataA.id] = true;
      }
      if (cancelB) {
        canceled[dataB.id] = true;
      }
    }
  }

  return _.reject(actions, (action) => canceled[action.id]);
};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports = class ActionListView extends View {
  initialize({ renderOpts, highlight }) {
    this.renderOpts = renderOpts;
    this.highlight = highlight;
    this.makeDebouncedMethods('render');
    this.listenTo(this.collection, 'add reset', this.renderDebounced);
    this.listenTo(this.collection, 'remove', () => {
      // ensure the comment view is removed from the DOM before rerendering
      this.removeActionViews();
      return this.renderDebounced();
    });
    this.actionViews = [];
    return (this.showDetails = true);
  }

  render() {
    return this.collection
      ._getRelatedBoards()
      .then(() => {
        const rerenderAll =
          this.$el.html() === '' ||
          this.showDetails !== this._lastShowDetails ||
          this.missingViews();
        this._lastShowDetails = this.showDetails;
        this.rerender(rerenderAll, true);
      })
      .then(() => {
        this.trigger('render');
      })
      .done();
  }

  missingViews() {
    // We can lose a view when an action is deleted; if we don't reset anything
    // then we'll do dumb things like trying to insert an action before something
    // that isn't in the DOM anymore
    return _.any(this.actionViews, (view) => {
      return !$.contains(this.el, view.el);
    });
  }

  sortActions(allActions) {
    return (allActions = _.sortBy(allActions, (a) =>
      Dates.parse(a.get('date')),
    ).reverse());
  }

  rerender(rerenderAll, removeExisting) {
    const [editTexts, cursorPos] = Array.from(this.saveEdits());

    let allActions = this.collection.models;

    if (featureFlagClient.get('nusku.filter-deleted-actions', false)) {
      // In some cases, the updates to the collection are being frame debounced
      // (i.e. they won't happen until the tab becomes visible, which could be
      // a long time after they happen).  Filter out any actions that have
      // been deleted - we'd crash if we tried to render them.
      allActions = allActions.filter(
        (action) =>
          // Hasn't be destructed
          action.attributes !== undefined &&
          // Is a placeholder, or is still in the model cache
          (!action.id ||
            this.modelCache.get('Action', action.id) !== undefined),
      );
    }

    allActions = this.sortActions(allActions);
    if (!this.showDetails) {
      allActions = _.filter(allActions, (a) => a.isCommentLike());
    }

    const actionList = removeCanceled(allActions).slice(
      0,
      this.renderOpts.limit,
    );
    // Rendering an action should happen:
    // 1. When all the actions need to be rerendered. This is handled
    //    separately for append efficiency
    // 2. When it is a new action added to the action list. All current actions
    //    shouldn't rerender
    // 3. When an action is replaced with another action. All current actions
    //    shouldn't rerender
    //
    // Rerendering should not happen:
    // 1. When a comment action is deleted, unless (in the case of the sidebar)
    //    a new action fills its place.

    if (rerenderAll && removeExisting) {
      this.removeActionViews();
    }

    // Add an empty message for board member profiles.
    this.$('.js-board-member-profile-no-activity').toggleClass(
      'hide',
      actionList.length > 0,
    );

    for (let index = 0; index < actionList.length; index++) {
      const action = actionList[index];
      if (rerenderAll || this.actionNeedsRerender(action, index)) {
        const view = this.rerenderAction(action, index, actionList, {
          rerenderAll,
        });
        this.restoreEdits(editTexts, cursorPos, view);
      }
    }
  }

  setShowDetails(value) {
    return (this.showDetails = value);
  }

  // Attempts to save in-progress comment edits
  saveEdits() {
    const editTexts = [];
    let cursorPos = 0;
    this.$('.editing textarea').each(function () {
      const $textarea = $(this);
      editTexts.push($textarea.val());
      if ($textarea.is(':focus')) {
        $textarea.parents('.editing').addClass('focused');
        cursorPos = Util.getCaretPosition($textarea);
      }
    });

    if (editTexts != null) {
      editTexts.reverse();
    }

    return [editTexts, cursorPos];
  }

  restoreEdits(editTexts, cursorPos, view) {
    if (view.$el.hasClass('editing')) {
      view.$('textarea').val(editTexts.pop());
      const textarea = Util.getElem(view.$('textarea'));
      if (view.$el.hasClass('focused')) {
        Util.setCaretPosition(textarea, cursorPos);
      }
      return view.openEditView();
    }
  }

  _viewForAction(action) {
    if (/^comment/.test(action.get('type'))) {
      return this.subview(CommentActionView, action, this.renderOpts);
    } else {
      return this.subview(ActionView, action, this.renderOpts);
    }
  }

  rerenderAction(action, index, actionList, options) {
    const view = this._viewForAction(action);

    const isHighlighted = this.highlight && this.highlight === action.id;
    view.setHighlighted(isHighlighted);

    if (options.rerenderAll) {
      this.appendSubview(view);
      this.actionViews.push(view);
    } else {
      this.insertActionView(view, index);

      // If this is the last view being rendered, just replace the current view
      // at index with this one. Special case is when there's only one actionView
      // and it's being replaced because we can't check if the next action in
      // actionList matches the next actionView
      if (this.actionViews.length === 1 && actionList.length === 1) {
        this.actionViews[index].remove();
        this.actionViews.splice(index, 1, view);
      } else if (this.actionViews[index + 1] == null) {
        this.actionViews.splice(index, 1, view);
      } else if (actionList.length <= this.actionViews.length) {
        // If there aren't more actions in actionList than currently rendered,
        // we need to remove some views
        // If the next action in actionList matches the next actionView,
        // then we should replace the current actionView with the rerendered
        // actionView
        if (
          this.actionViews[index + 1].model.id ===
          __guard__(_.first(actionList[index + 1]), (x) => x.id)
        ) {
          this.actionViews[index].remove();
          this.actionViews.splice(index, 1, view);
        } else {
          // If the view isn't replacing the one already in that place,
          // then remove a view from the end instead.
          this.actionViews.splice(index, 0, view);
          __guard__(this.actionViews[this.actionViews.length - 1], (x1) =>
            x1.remove(),
          );
          this.actionViews = this.actionViews.splice(
            0,
            this.actionViews.length - 1,
          );
        }
      } else {
        this.actionViews.splice(index, 0, view);
      }
    }

    return view;
  }

  actionNeedsRerender(action, index) {
    // Sometimes when actionViews are created with client only codepaths, the id
    // of the actionView is undefined. Comparing an undefined id to an undefined
    // next actionView would remove the actionView, disconnecting its events. To
    // fix this, we check the cid attribute when there is no id.
    const idKey = action.id != null ? 'id' : 'cid';
    // If the next actionView corresponds to the current model, then the action
    // for the current actionView must have been removed
    if (
      __guard__(
        __guard__(this.actionViews[index + 1], (x1) => x1.model),
        (x) => x[idKey],
      ) === action[idKey]
    ) {
      this.actionViews[index].remove();
      this.actionViews.splice(index, 1);
    }

    const actionView = this.actionViews[index];

    return !actionView || action[idKey] !== actionView.model[idKey];
  }

  insertActionView(view, position) {
    if (this.actionViews[position]) {
      view.delegateEvents();
      return view.render().$el.insertBefore(this.actionViews[position].el);
    } else {
      return this.appendSubview(view);
    }
  }

  removeActionViews() {
    this.removeSubviews();
    this.actionViews = [];
  }

  delegateEvents() {
    super.delegateEvents(...arguments);
    for (const actionView of Array.from(this.actionViews)) {
      actionView.delegateEvents();
    }
  }

  undelegateEvents() {
    super.undelegateEvents(...arguments);
    for (const actionView of Array.from(this.actionViews)) {
      actionView.undelegateEvents();
    }
  }

  remove() {
    this.removeActionViews();
    return super.remove(...arguments);
  }

  setHighlight(id) {
    let action, oldAction, view;
    if (id === this.highlight) {
      return;
    }

    if (
      this.highlight &&
      (oldAction = this.collection.get(this.highlight)) != null
    ) {
      view = this._viewForAction(oldAction);
      view.setHighlighted(false);
    }

    this.highlight = id;

    if (this.highlight && (action = this.collection.get(this.highlight))) {
      view = this._viewForAction(action);
      view.setHighlighted(true);
    }
  }
};
