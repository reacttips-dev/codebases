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
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ModelLoader } = require('app/scripts/db/model-loader');

const ViewWithActions = {
  limit: 50,
  nextPage: 1,
  shortLoad: false,
  loading: false,
  idModels: null,

  loadMoreActions() {
    if (this.loading) {
      return;
    }
    this.loading = true;

    return this.waitForId(this.model, () => {
      let left;
      return ModelLoader.loadMoreActionData(
        this.model.typeName.toLowerCase(),
        this.model.id,
        this.nextPage,
        this.limit,
        this.idModels,
        (left =
          typeof this.getActionsFilter === 'function'
            ? this.getActionsFilter()
            : undefined) != null
          ? left
          : 'all',
      )
        .finally(() => {
          return (this.loading = false);
        })
        .then((actions) => {
          this.shortLoad = actions.length < this.limit;
          this.renderActions();
          return ++this.nextPage;
        })
        .done();
    });
  },

  hasMoreActions() {
    return (
      !this.loading && !this.shortLoad && this.getActions().length >= this.limit
    );
  },

  getActions() {
    let left;
    const filteringModels =
      (left =
        typeof this.getFilteringModels === 'function'
          ? this.getFilteringModels()
          : undefined) != null
        ? left
        : [];
    return this.model.getActions(...Array.from(filteringModels || []));
  },
};

module.exports = ViewWithActions;
