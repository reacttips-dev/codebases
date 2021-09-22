const _ = require('lodash');
const typePrefix = '@@GRID_REACT';
const prefix = (data) => `${typePrefix}_${data}`;
const actionTypes = {
	FORCE_UPDATE: prefix('FORCE_UPDATE'),
	FORCE_UPDATE_ITEMS: prefix('FORCE_UPDATE_ITEMS'),
	UPDATE_VIEW: prefix('UPDATE_VIEW'),
	HOVER_ROW: prefix('HOVER_ROW'),
	CHANGE_GRID_HEIGHT: prefix('CHANGE_GRID_HEIGHT'),
	CHANGE_GRID_WIDTH: prefix('CHANGE_GRID_WIDTH'),
	MODIFY_TOTAL_BY: prefix('MODIFY_TOTAL_BY'),
	UPDATE_SUMMARY: prefix('UPDATE_SUMMARY'),
	RECALCULATE_RELATED_MODELS: prefix('RECALCULATE_RELATED_MODELS'),
	UPDATE_COLUMNS: prefix('UPDATE_COLUMNS'),
	EDIT_FIELD: prefix('EDIT_FIELD')
};

module.exports.types = actionTypes;

module.exports.forceUpdateItems = ({ scrollTop = 0, coveredRange, onComplete = _.noop }) => {
	return {
		type: actionTypes.FORCE_UPDATE_ITEMS,
		scrollTop,
		coveredRange,
		onComplete,
		collectionFetched: Date.now()
	};
};

module.exports.recalculateRelatedModels = () => {
	return {
		type: actionTypes.RECALCULATE_RELATED_MODELS
	};
};

module.exports.forceUpdate = (whenDone = _.noop) => {
	return {
		type: actionTypes.FORCE_UPDATE,
		whenDone
	};
};

module.exports.updateView = ({ customView, mainContentWidth }) => {
	return {
		type: actionTypes.UPDATE_VIEW,
		customView,
		mainContentWidth
	};
};

module.exports.hoverRow = (hoveredRowIndex) => {
	return {
		type: actionTypes.HOVER_ROW,
		hoveredRowIndex
	};
};

module.exports.changeGridHeight = ({ coveredRange, onComplete = _.noop }) => {
	return {
		type: actionTypes.CHANGE_GRID_HEIGHT,
		onComplete,
		coveredRange
	};
};

module.exports.changeGridWidth = ({ mainContentWidth, fixedContentWidth }) => {
	return {
		type: actionTypes.CHANGE_GRID_WIDTH,
		mainContentWidth,
		fixedContentWidth
	};
};

module.exports.modifyTotalBy = (amount, increase) => {
	return {
		type: actionTypes.MODIFY_TOTAL_BY,
		amount,
		increase
	};
};

module.exports.updateSummary = () => {
	return {
		type: actionTypes.UPDATE_SUMMARY
	};
};

module.exports.updateColumns = (columns) => {
	return {
		type: actionTypes.UPDATE_COLUMNS,
		columns
	};
};

module.exports.editField = (field) => {
	return {
		type: actionTypes.EDIT_FIELD,
		field
	};
};
