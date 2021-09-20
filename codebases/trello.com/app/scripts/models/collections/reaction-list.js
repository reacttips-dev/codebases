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
const { Auth } = require('app/scripts/db/auth');
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Reaction } = require('app/scripts/models/reaction');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');

const getIdEmoji = function (reaction) {
  const currentEmoji = reaction.get('emoji');
  const currentIdEmoji =
    currentEmoji.unified != null
      ? currentEmoji.unified.toUpperCase()
      : currentEmoji;
  return currentIdEmoji;
};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class ReactionList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Reaction;

    this.prototype._debouncedPersistUpdates = _.debounce(function () {
      _.each(this._pendingReactionUpdates, ({ updateFn }) => updateFn());
      return (this._pendingReactionUpdates = {});
    }, 1000);
  }

  initialize() {
    return (this._pendingReactionUpdates = {});
  }

  comparator(reaction) {
    return Util.idToDate(reaction.id);
  }

  findMyReaction(idEmoji) {
    return this.find((entry) => {
      return (
        entry.get('idMember') === Auth.myId() &&
        entry.get('idEmoji') === idEmoji
      );
    });
  }

  getAction(idAction) {
    return this.modelCache != null
      ? this.modelCache.get('Action', idAction)
      : undefined;
  }

  getUniqueCount() {
    return _.uniq(this.models, false, getIdEmoji).length;
  }

  isNewPile(reactionList, idEmoji) {
    // returns true if adding reaction with idEmoji will create a new pile
    return !_.some(
      reactionList.models,
      (reaction) => getIdEmoji(reaction) === idEmoji,
    );
  }

  reload(idAction) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ModelLoader.loadReactions(idAction).catch(() => {
      // We may have lost access to see the reactions.
      // Remove all reactions related to this action from the modelcache.
      return this.modelCache
        .all('Reaction')
        .filter((reaction) => reaction.get('idModel') === idAction)
        .forEach((reaction) => this.modelCache.remove(reaction));
    });
  }

  // Track function Returns true or false, for added or removed, respectively.
  toggleReaction(idAction, emoji, trackFn) {
    let existing;
    const idEmoji = emoji.unified.toUpperCase();

    if ((existing = this.findMyReaction(idEmoji))) {
      this.remove(existing);
      return this._registerReactionUpdate({
        idReaction: idEmoji,
        updateFn: () => {
          trackFn(false);
          return existing.destroy({
            error: (model, { status, responseJSON }) => {
              this.trigger('removeReactionError');
              // We've destroyed the model, and we need to reconcile the state
              // try reloading
              return this.reload(idAction);
            },
          });
        },
        model: existing,
      });
    } else {
      const actionModel = this.getAction(idAction);
      const reactionLimits = __guard__(
        actionModel != null ? actionModel.get('limits') : undefined,
        (x) => x.reactions,
      );
      if (
        (actionModel != null
          ? actionModel.isOverUniqueReactionsCapacity()
          : undefined) &&
        this.isNewPile(actionModel.reactionList, idEmoji)
      ) {
        this.trigger(
          'uniqueReactionLimit',
          reactionLimits != null ? reactionLimits.uniquePerAction : undefined,
        );
        return;
      }

      if (
        actionModel != null
          ? actionModel.isOverTotalReactionsCapacity()
          : undefined
      ) {
        this.trigger(
          'totalReactionLimit',
          (reactionLimits != null ? reactionLimits.perAction : undefined) ||
            actionModel.reactionList.length,
        );
        return;
      }

      const model =
        (this._pendingReactionUpdates[idEmoji] != null
          ? this._pendingReactionUpdates[idEmoji].model
          : undefined) ||
        new Reaction(
          {
            idModel: idAction,
            idMember: Auth.myId(),
            idEmoji,
            // this emoji object is not needed for the server payload
            // but allows us to render the reaction immediately upon adding to the model
            emoji,
          },
          { modelCache: this.modelCache },
        );
      return this._registerReactionUpdate({
        idReaction: idEmoji,
        updateFn: () => {
          trackFn(true);
          return model.save(null, {
            error: (model, { status, responseJSON }) => {
              // Because we cache requests it's possible that the client
              // manged to add more reactions than the server allows
              // if we error because of this let's alert the user and remove
              // the reactions that were added
              const message =
                responseJSON != null ? responseJSON.error : undefined;
              if (message != null) {
                // It's possible we've not loaded the reactionsLimits, as they
                // are loaded with the action model, which is not loaded when
                // loading reactions via the notifications. Calculate the limit
                // based on what we have locally as a best effort.
                if (message === 'ACTION_TOO_MANY_UNIQUE_REACTIONS') {
                  this.trigger(
                    'uniqueReactionLimit',
                    (reactionLimits != null
                      ? reactionLimits.uniquePerAction
                      : undefined) || { disableAt: this.getUniqueCount() - 1 },
                  );
                } else if (message === 'ACTION_TOO_MANY_TOTAL_REACTIONS') {
                  this.trigger(
                    'totalReactionLimit',
                    (reactionLimits != null
                      ? reactionLimits.perAction
                      : undefined) || { disableAt: this.models.length - 1 },
                  );
                }
              } else {
                this.trigger('addReactionError');
              }
              this.reload(idAction);
              return model.destroy();
            },
          });
        },
        model,
      });
    }
  }

  _registerReactionUpdate({ idReaction, updateFn, model }) {
    if (this._pendingReactionUpdates[idReaction] != null) {
      // Remove from pending updates, the user has just cancelled that operation
      delete this._pendingReactionUpdates[idReaction];
      model.destroy();
    } else {
      this._pendingReactionUpdates[idReaction] = {
        updateFn,
        model,
      };
    }

    return this._debouncedPersistUpdates();
  }
}
ReactionList.initClass();

module.exports.ReactionList = ReactionList;
