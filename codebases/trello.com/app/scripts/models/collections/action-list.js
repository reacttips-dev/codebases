/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Action } = require('app/scripts/models/action');
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const Promise = require('bluebird');
const _ = require('underscore');
const { ApiError } = require('app/scripts/network/api-error');

class ActionList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Action;
  }

  initialize(list, options) {
    this.options = options;
  }

  comparator(action) {
    return -action.getDate() || 0;
  }

  _getRelatedBoards() {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    let idBoardsRelated = (() => {
      const result = [];
      for (const model of Array.from(this.models)) {
        let needle;
        if (
          ((needle = model.get('type')),
          ['moveCardToBoard', 'moveCardFromBoard'].includes(needle))
        ) {
          const data = model.get('data');
          result.push(
            (data.boardTarget != null ? data.boardTarget.id : undefined) ||
              (data.boardSource != null ? data.boardSource.id : undefined),
          );
        }
      }
      return result;
    })();

    idBoardsRelated = _.compact(_.uniq(idBoardsRelated));
    idBoardsRelated = _.reject(
      idBoardsRelated,
      (idBoard) => this.modelCache.get('Board', idBoard) != null,
    );

    return Promise.resolve(idBoardsRelated).map((idBoard) => {
      return ModelLoader.loadBoardName(idBoard).catch(
        ApiError.Unauthorized,
        ApiError.NotFound,
        function () {},
      );
    });
  }
}
ActionList.initClass();

module.exports.ActionList = ActionList;
