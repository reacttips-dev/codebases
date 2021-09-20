// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ActionHistory } = require('@trello/action-history');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/checklist_add_menu');
const { trackDebounced } = require('@trello/analytics');
const { ModelCache } = require('app/scripts/db/model-cache');
const BluebirdPromise = require('bluebird');
const { Feature } = require('app/scripts/debug/constants');
const { sendErrorEvent } = require('@trello/error-reporting');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'checklist_add_menu',
);
const { Analytics } = require('@trello/atlassian-analytics');

const alphabeticallyOn = (field) => (a, b) =>
  a.get(field).localeCompare(b.get(field));

const defaultChecklistName = t.l('default-checklist-name');

const MAX_SUGGESTIONS = 3;

function hasChecklists(idBoard) {
  return (card) =>
    card.get('idBoard') === idBoard &&
    card.isVisible() &&
    card.checklistList.length > 0;
}

const optionsTemplate = t.renderable((checklistCards) => {
  t.span(() => {
    t.label({ for: 'js-checklist-copy-source' }, () =>
      t.format('copy-items-from-ellipsis'),
    );
    t.select('.js-checklist-copy-source', () => {
      t.option({ value: '', selected: true }, () => t.format('none'));
      checklistCards.forEach(({ name, checklists }) =>
        t.optgroup({ label: name }, () =>
          checklists.forEach(({ id, name }) =>
            t.option({ value: id }, () => t.text(name)),
          ),
        ),
      );
    });
  });
});

class AddChecklistMenu extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'add checklist';

    this.prototype.events = {
      'click .js-add-checklist': 'submit',
      'submit form': 'submit',
      'focus .js-checklist-copy-source.js-uninitialized': 'populateSource',
      'change .js-checklist-copy-source': 'changeSource',
      'input .js-checklist-title'(e) {
        return this.$('.js-checklist-title').attr('data-changed', true);
      },
      'click .js-suggested-checklist': 'suggestedChecklist',
    };
  }

  initialize({ cardView }) {
    this.cardView = cardView;
  }

  _canAddChecklist(model, limitType) {
    return !model.isOverLimit('checklists', limitType);
  }

  render() {
    try {
      const suggestions = this.getSuggestedChecklists();

      this.$el.html(
        template({
          canCopy: this.modelCache.some(
            'Card',
            hasChecklists(this.model.getBoard().id),
          ),
          suggestions,
          canAddChecklistCard: this._canAddChecklist(this.model, 'perCard'),
          canAddChecklistBoard: this._canAddChecklist(
            this.model.getBoard(),
            'perBoard',
          ),
        }),
      );

      if (suggestions.length > 0) {
        trackDebounced.hour(
          'Suggestions',
          'Card Checklist Menu',
          'Displayed',
          suggestions.length,
        );
      }

      Analytics.sendScreenEvent({
        name: 'addChecklistInlineDialog',
        containers: this.model.getAnalyticsContainers(),
        attributes: {
          cardIsTemplate: this.model.get('isTemplate'),
          cardIsClosed: this.model.get('closed'),
        },
      });

      return this;
    } catch (err) {
      sendErrorEvent(err, {
        tags: {
          ownershipArea: 'trello-panorama',
          feature: Feature.Checklists,
        },
      });
    }
  }

  getSuggestedChecklists() {
    const history = ActionHistory.get();
    const idList = this.model.get('idList');
    const suggested = new Set();

    return history
      .filter(
        ({ action, context }) =>
          action.type === 'add-checklist' &&
          // Only add checklists we've added to other cards in this list
          context.idList === idList &&
          action.idChecklistSource &&
          action.name &&
          action.name !== defaultChecklistName,
      )
      .filter(({ action }) => {
        if (suggested.has(action.idChecklistSource)) {
          return false;
        } else {
          suggested.add(action.idChecklistSource);
          return true;
        }
      })
      .filter(({ action }) => this.model.isValidSuggestion(action))
      .slice(0, MAX_SUGGESTIONS)
      .map(({ action }) => ({
        id: action.idChecklistSource,
        name: action.name,
      }));
  }

  addChecklist(
    idChecklistSource,
    title,
    fromSuggestion,
    traceId,
    onSuccess,
    onFail,
    onAbort,
  ) {
    if (
      !(
        this._canAddChecklist(this.model, 'perCard') &&
        this._canAddChecklist(this.model.getBoard(), 'perBoard')
      )
    ) {
      this.render();
      onAbort();
      return;
    }

    this.model.recordAction({
      type: 'add-checklist',
      idChecklistSource: idChecklistSource || undefined,
      name: title === defaultChecklistName ? undefined : title,
    });

    const copied = idChecklistSource !== '';

    const checklist = this.model.checklistList.createWithTracing(
      {
        name: title,
        idChecklistSource,
        idCard: this.model.id,
      },
      {
        traceId,
        success: () => {
          Analytics.sendTrackEvent({
            action: copied ? 'copied' : 'created',
            actionSubject: 'checklist',
            source: 'addChecklistInlineDialog',
            containers: {
              card: { id: this.model.get('id') },
              board: { id: this.model.getBoard().id },
            },
            attributes: {
              taskId: traceId,
              usedDefaultName: title === defaultChecklistName,
              copied: idChecklistSource !== '',
              fromSuggestion: fromSuggestion,
            },
          });

          onSuccess();
        },
        error: (model, error) => {
          // The checklist is optimisitically added.
          // If the add fails, remove the checklist
          this.model.checklistList.remove(checklist);

          onFail(error);
        },
      },
    );

    return this.cardView.focusChecklistAdd(checklist);
  }

  suggestedChecklist(e) {
    const $target = this.$(e.currentTarget);

    const idChecklistSource = $target.attr('data-id');
    const name = $target.attr('data-name');

    const copied = idChecklistSource !== '';
    const taskName = copied ? 'create-checklist/copy' : 'create-checklist';
    const tracingProps = {
      taskName,
      attributes: {
        fromSuggestion: true,
      },
      source: 'addChecklistInlineDialog',
    };

    const traceId = Analytics.startTask(tracingProps);
    const onSuccess = () =>
      Analytics.taskSucceeded({
        ...tracingProps,
        traceId,
      });
    const onAbort = () => {
      throw Analytics.taskAborted({
        ...tracingProps,
        traceId,
      });
    };
    const onFail = (error) => {
      throw Analytics.taskFailed({
        ...tracingProps,
        traceId,
        error,
      });
    };

    this.addChecklist(
      idChecklistSource,
      name,
      true,
      traceId,
      onSuccess,
      onFail,
      onAbort,
    );

    PopOver.hide();
  }

  submit(e) {
    Util.stop(e);

    const title = this.$('.js-checklist-title').val();
    const idChecklistSource = this.$('.js-checklist-copy-source').val();

    if (title.length === 0) {
      this.$('.js-checklist-title').focus().select();
      return;
    }

    const copied = idChecklistSource !== '';

    const taskName = copied ? 'create-checklist/copy' : 'create-checklist';
    const tracingProps = {
      taskName,
      attributes: {
        fromSuggestion: false,
      },
      source: 'addChecklistInlineDialog',
    };

    const traceId = Analytics.startTask(tracingProps);
    const onSuccess = () =>
      Analytics.taskSucceeded({
        ...tracingProps,
        traceId,
      });
    const onAbort = () =>
      Analytics.taskAborted({
        ...tracingProps,
        traceId,
      });
    const onFail = (error) => {
      throw Analytics.taskFailed({
        ...tracingProps,
        traceId,
        error,
      });
    };

    new BluebirdPromise((resolve) => {
      // Maybe they went really fast and tried to create a checklist before
      // the card finished creating
      if (!this.model.id) {
        this.$('.js-add-checklist')
          .prop('disabled', true)
          .toggleClass('disabled', true);
        return this.waitForId(this.model, resolve);
      } else {
        return resolve();
      }
    }).then(() => {
      this.addChecklist(
        idChecklistSource,
        title,
        false,
        traceId,
        onSuccess,
        onFail,
        onAbort,
      );

      return PopOver.hide();
    });
  }

  populateSource(e) {
    const target = e.currentTarget;
    target.classList.remove('js-uninitialized');

    const checklistCards = this.modelCache
      .find('Card', hasChecklists(this.model.getBoard().id))
      .sort(alphabeticallyOn('name'))
      .map((card) => ({
        name: card.get('name'),
        checklists: card.checklistList
          .chain()
          .clone()
          .filter((checklist) =>
            // It's possible that we've got checklists in the cache
            // that we don't know the name of; this can happen if
            // we received a websocket update about a checklist on
            // a card while the card was closed, and it was then
            // reopened before we opened the checklist menu
            checklist.get('name'),
          )
          .sort(alphabeticallyOn('name'))
          .map((checklist) => ({
            id: checklist.id,
            name: checklist.get('name'),
          }))
          .value(),
      }));

    target.innerHTML = optionsTemplate(checklistCards);
  }

  changeSource(e) {
    let sourceChecklist;
    const $checklistTitle = this.$('.js-checklist-title');
    const defaultName = $checklistTitle.attr('data-default');

    // If they've modified it to something other than the default/blank don't overwrite their input
    if (
      $checklistTitle.attr('data-changed') &&
      $checklistTitle.val() &&
      $checklistTitle.val() !== defaultName
    ) {
      return;
    }

    const idChecklistSource = this.$('.js-checklist-copy-source').val();
    const newName =
      idChecklistSource &&
      (sourceChecklist = ModelCache.get(
        'Checklist',
        idChecklistSource,
      )) /* eslint-disable-line eqeqeq */ != null
        ? sourceChecklist.get('name')
        : defaultName;

    return $checklistTitle.val(newName).removeAttr('data-changed');
  }
}

AddChecklistMenu.initClass();
module.exports = AddChecklistMenu;
