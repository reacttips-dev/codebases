const ServiceLoader = require('components/service-loader/index');
const moment = require('moment');
const BulkEditUtils = require('utils/bulk-edit-utils');
const { marketingStatusCoachMark } = require('views/shared/marketing-status-utils');
const _ = require('lodash');
const componentLoader = require('webapp-component-loader');

module.exports = ServiceLoader.extend({
	component: 'froot:bulkActions',
	serviceName: 'Async Bulk Edit',
	options: null,

	initialize(options) {
		this.options = options;
		this.collection = options.collection;
		this.listSettings = options.listSettings;

		const resetOnEvents = [
			'before:changed:custom-view',
			'before:reset:first-letter',
			'before:changed:first-letter',
			'before:changed:filter',
			'before:changed:custom-filter'
		];

		options.listSettings.on(resetOnEvents.join(' '), this.reset, this);

		ServiceLoader.prototype.initialize.call(this);

		// HACK: Can't tell when view is unloaded in froot, so checking for route changes instead. FUN-1341
		componentLoader.load('froot:router').then((router) => {
			this.reset = this.reset.bind(this);
			this.router = router;
			this.router.on('routeChange', this.reset);
		});
	},

	async renderPage(bulkActionsComponent) {
		this.bulkActionsComponent = bulkActionsComponent;
		this.renderComponent();
	},

	renderComponent() {
		const { options, collection, listSettings } = this;

		this.bulkActionsComponent.open({
			type: collection.type,
			totalCount: listSettings.summaryModel.get('total_count'),
			visibleCount: collection.length,
			criteria: {
				bulkEditFilter: collection.bulkEditFilter,
				selectedIds: collection.selectedIds,
				excludedIds: collection.excludedIds
			},
			canBulkDelete: options.canBulkDelete,
			bulkDeleteEl: options.bulkDeleteEl,
			onClose: () => {
				this.reset();
			},
			onSubmit: () => {
				this.reset();
			},
			onDone: () => {
				this.update();
			}
		});

		setTimeout(() => {
			marketingStatusCoachMark.show('PROMOTE_MARKETING_BULK_EDIT');
		}, 600);
	},

	reset() {
		const { collection } = this.options;

		collection.selectedIds = [];
		collection.excludedIds = [];
		_.unset(collection, 'bulkEditFilter');

		// This will eventually call "close"
		collection.trigger('selected', false);
	},

	close() {
		marketingStatusCoachMark.hide('PROMOTE_MARKETING_BULK_EDIT');
		this.bulkActionsComponent?.close();
	},

	// This is a copy-paste from the original webapp's bulk-edit code
	update() {
		const collection = this.collection;
		const models = collection.filter(collection.selectedIds);
		const existingRelatedModels = collection.getRelatedModelsObject();

		BulkEditUtils.fetchRelatedModels({}, existingRelatedModels, (relatedModels) => {
			relatedModels.forEach((relatedModel) => {
				collection.setCachedRelatedModel(relatedModel.type, relatedModel.id, relatedModel);
			});
			models.forEach((model) => {
				model.set({}, { updatedFromBulkEdit: true });

				// eslint-disable-next-line camelcase
				if (model.collection.options.filter?.filter_id) {
					model.meta = {
						id: model.id,
						timestamp: moment()
							.utc()
							.format('X'),
						user_id: app.global.user_id,
						matches_filters: {
							current: [model.collection.options.filter.filter_id]
						}
					};
				}

				app.global.fire(`${collection.type}.model.${model.id}.update`, model);
			});
		});
		// update summary
		this?.options?.listSettings?.syncSummary();
	},

	remove() {
		this.router?.off('routeChange', this.reset);
	}
});
