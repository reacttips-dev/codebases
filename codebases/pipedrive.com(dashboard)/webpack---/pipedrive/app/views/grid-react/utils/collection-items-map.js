const _ = require('lodash');
const Pipedrive = require('pipedrive');
const debounceEvents = require('views/grid-react/utils/debounce-events');
const numbers = (first, second) => first - second;
const cleanCollectionItemsMap = (collectionItemsMap) => {
	collectionItemsMap.itemsMap = {};

	collectionItemsMap.itemsIds = {};
	collectionItemsMap.insertedIds = {};
	collectionItemsMap.refetchedIdsCount = 0;

	collectionItemsMap.fetchedCollectionIndexesCache = [];
};
const toIndexesSet = (...arrays) => {
	const combinedArray = [].concat(...arrays);

	return _.uniq(combinedArray.map(Number)).sort(numbers);
};
const CollectionItemsMap = function CollectionItemsMap() {
	cleanCollectionItemsMap(this);
	this.debouncedAddTrigger = debounceEvents.debouncedTrigger(this, 'add');
	this.debouncedRemoveTrigger = debounceEvents.debouncedTrigger(this, 'remove');
};
const findIndexesById = (collectionItemsMap, id) => {
	const itemsMap = _.pickBy(collectionItemsMap.itemsMap, (itemId) => itemId === id);

	return _.keys(itemsMap).map(Number);
};
const calculateInsertedItems = (collectionItemsMap, index, isBefore = true) => {
	const multiplier = isBefore ? 1 : -1;

	return _.reduce(
		collectionItemsMap.insertedIds,
		(shift, insertedId) => {
			if (insertedId * multiplier <= index * multiplier) {
				return shift + 1;
			}

			return shift;
		},
		0
	);
};
const calculateItemsInsertedBefore = (collectionItemsMap, index) => {
	return calculateInsertedItems(collectionItemsMap, index);
};
const calculateItemsInsertedAfter = (collectionItemsMap, index) => {
	return calculateInsertedItems(collectionItemsMap, index, false);
};
const shiftStep = (index, startIndex, forIndexes, isDown = true) => {
	const multiplier = isDown ? 1 : -1;

	return _.reduce(
		forIndexes,
		(shift, shiftIndex) => {
			if (
				index * multiplier < shiftIndex * multiplier &&
				index * multiplier > startIndex * multiplier
			) {
				return shift + 1;
			}

			return shift;
		},
		0
	);
};
const downShiftStep = (index, startIndex, forIndexes) => {
	return shiftStep(index, startIndex, forIndexes);
};
const upShiftStep = (index, startIndex, forIndexes) => {
	return shiftStep(index, startIndex, forIndexes, false);
};
const shiftInsertedIds = (collectionItemsMap, startIndex, idsToShift) => {
	const downShifts = _.pickBy(idsToShift, (index) => index >= startIndex);
	const downShiftIndexes = _.values(downShifts).map(Number);
	const downShiftMargin = calculateItemsInsertedAfter(collectionItemsMap, startIndex);
	const upShifts = _.pickBy(idsToShift, (index) => index < startIndex);
	const upShiftIndexes = _.values(upShifts).map(Number);
	const upShiftMargin = calculateItemsInsertedBefore(collectionItemsMap, startIndex);
	const idsToRemove = _.keys(idsToShift).map(Number);
	const transformedData = _.transform(
		collectionItemsMap.itemsMap,
		(transformedData, mapItem, itemIndex) => {
			let itemIndexNr = Number(itemIndex);

			const itemId = Number(mapItem);

			const downShift = downShiftStep(
				itemIndexNr,
				startIndex - downShiftMargin,
				downShiftIndexes
			);

			const upShift = upShiftStep(itemIndexNr, startIndex + upShiftMargin, upShiftIndexes);

			if (idsToRemove.indexOf(itemId) !== -1) {
				delete transformedData.insertedIds[itemId];
				delete transformedData.itemsIds[itemId];

				return transformedData;
			}

			itemIndexNr = itemIndexNr + downShift - upShift;

			transformedData.itemsMap[itemIndexNr] = itemId;

			if (!_.isNaN(itemId)) {
				if (_.isNumber(transformedData.insertedIds[itemId])) {
					transformedData.insertedIds[itemId] = itemIndexNr;
				}

				transformedData.itemsIds[itemId] = itemIndexNr;
			}

			return transformedData;
		},
		{
			itemsMap: {},
			insertedIds: collectionItemsMap.insertedIds,
			itemsIds: collectionItemsMap.itemsIds
		}
	);

	collectionItemsMap.itemsMap = transformedData.itemsMap;
	collectionItemsMap.insertedIds = transformedData.insertedIds;
	collectionItemsMap.itemsIds = transformedData.itemsIds;
};
const removeIndexesFromItemsMap = (itemsMap, removeIndexes) => {
	let shift = 0;

	if (removeIndexes.length === 0) {
		return itemsMap;
	}

	return _.transform(
		itemsMap,
		(itemsMap, mapItem, itemIndex) => {
			let mapItemIndex = Number(itemIndex);

			if (removeIndexes.indexOf(mapItemIndex) !== -1) {
				shift++;

				return itemsMap;
			}

			mapItemIndex = mapItemIndex - shift;
			itemsMap[mapItemIndex] = _.cloneDeep(mapItem);

			return itemsMap;
		},
		{}
	);
};
const removeIdFromItemsMap = (collectionItemsMap, id) => {
	const indexes = findIndexesById(collectionItemsMap, id);

	collectionItemsMap.itemsMap = removeIndexesFromItemsMap(collectionItemsMap.itemsMap, indexes);
	collectionItemsMap.insertedIds = _.omitBy(
		collectionItemsMap.insertedIds,
		(index, itemId) => Number(itemId) === id
	);
	collectionItemsMap.itemsIds = _.omitBy(
		collectionItemsMap.itemsIds,
		(index, itemId) => Number(itemId) === id
	);

	return indexes;
};
const downsertItemsToCollection = (collectionItemsMap, items, startIndex) => {
	let currentIndex = startIndex;

	const ids = items.map((item) => Number(item.id));
	const idsToShift = _.pickBy(
		collectionItemsMap.insertedIds,
		(index, id) => ids.indexOf(Number(id)) !== -1
	);

	shiftInsertedIds(collectionItemsMap, currentIndex, idsToShift);

	_.forEach(items, (item) => {
		const id = item ? item.id || item.get('id') : null;

		const idExists = _.isNumber(collectionItemsMap.itemsIds[id]);

		let indexExists = _.isNumber(collectionItemsMap.itemsMap[currentIndex]);

		while (indexExists) {
			currentIndex++;
			indexExists = _.isNumber(collectionItemsMap.itemsMap[currentIndex]);
		}

		if (idExists) {
			return;
		}

		collectionItemsMap.itemsMap[currentIndex] = id;

		if (id) {
			collectionItemsMap.itemsIds[id] = currentIndex;
		}

		currentIndex++;
	});
};
const upsertItemsToCollection = (collectionItemsMap, items, startIndex) => {
	let currentIndex = startIndex + items.length;

	const ids = items.map((item) => Number(item.id));
	const idsToShift = _.pickBy(
		collectionItemsMap.insertedIds,
		(index, id) => ids.indexOf(Number(id)) !== -1
	);

	shiftInsertedIds(collectionItemsMap, currentIndex, idsToShift);

	_.forEachRight(items, (item) => {
		const id = item ? item.id || item.get('id') : null;

		const idExists = _.isNumber(collectionItemsMap.itemsIds[id]);

		let indexExists = _.isNumber(collectionItemsMap.itemsMap[currentIndex]);

		while (indexExists) {
			currentIndex--;
			indexExists = _.isNumber(collectionItemsMap.itemsMap[currentIndex]);
		}

		if (idExists) {
			return;
		}

		collectionItemsMap.itemsMap[currentIndex] = id;

		if (id) {
			collectionItemsMap.itemsIds[id] = currentIndex;
		}

		currentIndex--;
	});
};
const updateCollectionItemsMap = (collectionItemsMap, items, startIndex, direction = 'down') => {
	if (direction === 'down') {
		downsertItemsToCollection(collectionItemsMap, items, startIndex);
	} else {
		upsertItemsToCollection(collectionItemsMap, items, startIndex);
	}

	collectionItemsMap.fetchedCollectionIndexesCache = toIndexesSet(
		_.keys(collectionItemsMap.itemsMap)
	);
};
const insertItemAtIndex = (itemsMap, newItemIndex, item) => {
	let lastIndex = -1;
	let insertedAtIndex = -1;

	const movedItemsMap = _.transform(
		itemsMap,
		(itemsMap, existingItem, itemIndex) => {
			let mapItemIndex = parseInt(itemIndex, 10);

			lastIndex = mapItemIndex;

			if (mapItemIndex === newItemIndex) {
				insertedAtIndex = newItemIndex;
				itemsMap[mapItemIndex] = item;
			}

			if (mapItemIndex >= newItemIndex) {
				mapItemIndex += 1;
			}

			itemsMap[mapItemIndex] = _.cloneDeep(existingItem);

			return itemsMap;
		},
		{}
	);

	if (insertedAtIndex < 0) {
		insertedAtIndex = lastIndex + 1;
	}

	movedItemsMap[insertedAtIndex] = item;

	return { movedItemsMap, insertedAtIndex };
};
const downScrollDiffStart = (collectionItemsMap, diffs) => {
	const initialDiff = Math.max(_.min(diffs), 0);
	const itemsInsertedBefore = calculateItemsInsertedBefore(collectionItemsMap, initialDiff);

	return initialDiff - itemsInsertedBefore;
};
const upScrollDiffStart = (collectionItemsMap, diffs, totalCount) => {
	const initialDiff = _.max(diffs) + 1;
	const itemsInsertedAfter = calculateItemsInsertedAfter(collectionItemsMap, initialDiff);

	return Math.min(initialDiff + itemsInsertedAfter, totalCount);
};

_.assignIn(
	CollectionItemsMap.prototype,
	{
		updateItems(items, startIndex, direction) {
			if (!items) {
				return this;
			}

			updateCollectionItemsMap(this, items, startIndex, direction);
			this.trigger('update');

			return this;
		},

		uncoveredDiff(range = { top: 0, bottom: 0 }) {
			if (range.top > range.bottom) {
				return [];
			}

			return _.difference(
				_.range(range.top, range.bottom),
				this.fetchedCollectionIndexesCache
			);
		},

		diffStartIndex(range = { top: 0, bottom: 0 }, direction = 'down', totalCount = 0) {
			const uncoveredDiff = this.uncoveredDiff({
				top: Math.max(range.top, 0),
				bottom: Math.min(range.bottom, totalCount)
			});

			if (_.isEmpty(uncoveredDiff)) {
				return -1;
			}

			return direction === 'down'
				? downScrollDiffStart(this, uncoveredDiff)
				: upScrollDiffStart(this, uncoveredDiff, totalCount);
		},

		at(index) {
			return this.itemsMap[index] ? this.itemsMap[index] : null;
		},

		insertItemAt(index, model) {
			const id = model ? model.id || model.get('id') : null;
			const insertResults = insertItemAtIndex(this.itemsMap, index, id);

			this.itemsMap = insertResults.movedItemsMap;
			this.fetchedCollectionIndexesCache = toIndexesSet(_.keys(this.itemsMap));

			if (id) {
				this.insertedIds[id] = insertResults.insertedAtIndex;
				this.itemsIds[id] = insertResults.insertedAtIndex;
			}

			this.debouncedAddTrigger({ index: insertResults.insertedAtIndex, id });

			return this;
		},

		removeById(id) {
			const removedIndexes = removeIdFromItemsMap(this, id, true);

			this.debouncedRemoveTrigger({ indexes: removedIndexes, id });

			return this;
		},

		reset(items, startIndex) {
			cleanCollectionItemsMap(this);
			updateCollectionItemsMap(this, items, startIndex);
			this.trigger('reset');

			return this;
		}
	},
	Pipedrive.Events
);

module.exports = CollectionItemsMap;
