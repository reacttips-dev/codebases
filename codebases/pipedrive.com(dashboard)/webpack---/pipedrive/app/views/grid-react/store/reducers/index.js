const _ = require('lodash');
const gridMatrix = require('../../utils/grid-matrix');
const actions = require('../actions/index');
const drawableMatrix = require('views/grid-react/store/reducers/commons/drawable-matrix');
const updateItems = require('./update-items');
const recalculateRelatedModels = require('./recalculate-related-models');
const forceUpdate = require('./force-update');
const updateView = require('./update-view');
const updateColumns = require('./update-columns');
const hoverRow = require('./hover-row');
const modifyTotalBy = require('./modify-total-by');
const updateSummary = require('./update-summary');
const changeGridWidth = require('./change-grid-width');
const editField = require('./edit-field');

module.exports = (state = {}, action) => {
	const reducerForAction = module.exports[action.type];

	if (reducerForAction) {
		const nextState = reducerForAction(state, action);

		return drawableMatrix(nextState);
	}

	return state;
};

module.exports.getInitialState = (props, methods) => {
	const { buffer, customView, mainContentWidth, fixedContentWidth, summary } = props;
	const { calculateDisplayRange } = methods;
	const coveredRange = calculateDisplayRange(0);
	const matrixSize = Math.abs(coveredRange.bottom - coveredRange.top - 2 * buffer);
	const total = (summary && summary.get('total_count')) || 0;

	return drawableMatrix(
		_.assignIn(props, {
			scrollTop: 0,
			coveredRange,
			matrix: gridMatrix.prepareEmpty(matrixSize, buffer),
			collectionFetched: Date.now(),
			firstRowOffset: 0,
			columns: customView.getColumnsFieldsArray(),
			mainContentWidth,
			fixedContentWidth,
			hoveredRowIndex: null,
			isEditing: null,
			total,
			relatedModels: {}
		})
	);
};

module.exports[actions.types.FORCE_UPDATE_ITEMS] = updateItems;
module.exports[actions.types.RECALCULATE_RELATED_MODELS] = recalculateRelatedModels;
module.exports[actions.types.FORCE_UPDATE] = forceUpdate;
module.exports[actions.types.UPDATE_VIEW] = updateView;
module.exports[actions.types.UPDATE_COLUMNS] = updateColumns;
module.exports[actions.types.HOVER_ROW] = hoverRow;
module.exports[actions.types.MODIFY_TOTAL_BY] = modifyTotalBy;
module.exports[actions.types.UPDATE_SUMMARY] = updateSummary;
module.exports[actions.types.CHANGE_GRID_WIDTH] = changeGridWidth;
module.exports[actions.types.EDIT_FIELD] = editField;
