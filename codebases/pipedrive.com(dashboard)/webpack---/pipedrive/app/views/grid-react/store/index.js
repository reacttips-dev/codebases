const redux = require('redux');
const _ = require('lodash');
const User = require('models/user');
const { createStore } = redux;
const actions = require('./actions/index');
const reducers = require('./reducers/index');

class GridReactStore {
	constructor(props, methods) {
		const { collection, collectionItems, summary } = props;

		let stateRelatedModelsHash;

		this.props = props;
		this.store = createStore(reducers, reducers.getInitialState(props, methods));
		this.methods = methods;
		this.modelsListened = [];
		this.boundForceUpdate = _.ary(this.forceUpdate.bind(this), 0);
		this.debouncedForceUpdate = _.debounce(_.ary(_.bind(this.forceUpdate, this), 0), 1000, {
			leading: true
		});
		this.store.subscribe(() => {
			const state = this.store.getState();
			const relatedModelsHash = _.cloneDeep(state.relatedModelsHash);
			const { relatedModels } = state;

			if (_.isEqual(stateRelatedModelsHash, relatedModelsHash)) {
				return;
			}

			stateRelatedModelsHash = relatedModelsHash;
			this.unbindRelatedModelsChanges();
			this.bindRelatedModelsChanges(relatedModels);
		});

		collection.on('selected', this.updateSelection, this);
		collection.on('change', this.debouncedForceUpdate, this);
		summary.on('sync', this.updateSummary, this);
		collectionItems.on('add', this.increaseTotalBy, this);
		collectionItems.on('remove', this.decreaseTotalBy, this);
		collectionItems.on('reset update', this.updateItems, this);

		User.fields.on('changed', this.updateColumns, this);
	}

	bindRelatedModelsChanges(relatedModels) {
		this.modelsListened = _.reduce(
			relatedModels,
			(modelsListened, modelsSet) => {
				modelsListened = _.unionBy(
					modelsListened,
					_.values(modelsSet),
					(model) => model.id || model.get('id')
				);

				return modelsListened;
			},
			[]
		);
		_.forEach(this.modelsListened, (subModel) => {
			subModel.on('change', this.boundForceUpdate);
		});
	}

	unbindRelatedModelsChanges() {
		_.forEach(this.modelsListened, (subModel) => {
			subModel.off('change', this.boundForceUpdate);
		});
	}

	updateItems(scrollTop, onComplete = _.noop) {
		scrollTop = _.isNil(scrollTop) ? this.store.getState().scrollTop : scrollTop;
		const coveredRange = this.methods.calculateDisplayRange(scrollTop);

		this.store.dispatch(actions.forceUpdateItems({ scrollTop, coveredRange, onComplete }));
		this.store.dispatch(actions.recalculateRelatedModels());
	}

	forceUpdate(whenDone = _.noop) {
		this.store.dispatch(actions.forceUpdate(whenDone));
		this.store.dispatch(actions.recalculateRelatedModels());
	}

	updateView({ customView, mainContentWidth }) {
		this.store.dispatch(actions.updateView({ customView, mainContentWidth }));
	}

	changeGridHeight(onComplete = _.noop) {
		const { scrollTop } = this.store;
		const coveredRange = this.methods.calculateDisplayRange(scrollTop);

		this.store.dispatch(actions.changeGridHeight({ coveredRange, onComplete }));
	}

	changeGridWidth(mainContentWidth, fixedContentWidth) {
		this.store.dispatch(actions.changeGridWidth({ mainContentWidth, fixedContentWidth }));
	}

	setMethods({ methods }) {
		this.methods = methods;
	}

	modifyTotalBy(amount, increase = 1) {
		this.store.dispatch(actions.modifyTotalBy(amount, increase));
		this.store.dispatch(actions.recalculateRelatedModels());
	}

	increaseTotalBy(amount) {
		this.modifyTotalBy(amount, 1);
	}

	decreaseTotalBy(amount) {
		this.modifyTotalBy(amount, -1);
	}

	updateSummary() {
		this.store.dispatch(actions.updateSummary());
	}

	updateSelection() {
		this.store.dispatch(actions.forceUpdate(_.noop));
	}

	updateColumns() {
		const columns = this.props.customView.getColumnsFieldsArray();

		this.store.dispatch(actions.updateColumns(columns));
	}

	getStore() {
		return this.store;
	}

	unload() {
		const { collection, collectionItems, summary } = this.props;

		collection.off('selected', this.updateSelection, this);
		collection.off('change', this.debouncedForceUpdate, this);
		summary.off('sync', this.updateSummary, this);
		collectionItems.off('add', this.increaseTotalBy, this);
		collectionItems.off('remove', this.decreaseTotalBy, this);
		collectionItems.off('reset update', this.updateItems, this);

		User.fields.off('changed', this.updateColumns, this);
	}
}

module.exports = GridReactStore;
