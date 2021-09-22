import { fromJS } from 'immutable';
import { parseCalendarItem, mergeCalendarItems } from '../../../utils/activity';

export const initialState = fromJS({
	items: [],
	isAlldayCollapsed: true,
	visibleAlldayItems: 4,
	currentDraggableItem: null,
	currentResizingItem: null,
	relatedObjects: {},
	isConferenceMeetingIntegrationInstalled: false,
});

const purgeCalendarItems = (state, action) => {
	let purgedItems = state.get('items').filter((item) => item.get('type') !== action.itemsType);

	if (action.items) {
		purgedItems = purgedItems.withMutations((purgedItems) => {
			action.items.forEach((item) => item && purgedItems.push(parseCalendarItem(item)));
		});
	}

	return state.set('items', purgedItems);
};

const updateCalendarItem = (state, action) => {
	const items = state.get('items');
	const [index, item] = items.findEntry((item) => item.get('id') === action.data.get('id')) || [];

	if (!item && action.data.get('id')) {
		return state.set('items', items.push(parseCalendarItem(action.data)));
	}

	return state.setIn(['items', index], parseCalendarItem(mergeCalendarItems(item, action.data)));
};

const removeCalendarItem = (state, action) => {
	const items = state.get('items');
	const index = items.findIndex((item) => item.get('id') === action.id);

	if (index === -1) {
		return state;
	}

	return state.set('items', items.remove(index));
};

// eslint-disable-next-line complexity
export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'CALENDAR_ITEMS':
			return purgeCalendarItems(state, action);
		case 'CALENDAR_UPDATE_RELATED_OBJECTS':
			return state.set(
				'relatedObjects',
				state.get('relatedObjects').mergeDeep(action.relatedObjects),
			);
		case 'CALENDAR_UPDATE_ITEM':
			return updateCalendarItem(state, action);
		case 'CALENDAR_REMOVE_ITEM':
			return removeCalendarItem(state, action);
		case 'CALENDAR_ALLDAY_COLLAPSE':
			return state.set('isAlldayCollapsed', !!action.isAlldayCollapsed);
		case 'CALENDAR_CURRENT_DRAGGABLE_ITEM':
			return state.set('currentDraggableItem', action.currentDraggableItem);
		case 'CALENDAR_CURRENT_RESIZING_ITEM':
			return state.set('currentResizingItem', action.currentResizingItem);
		case 'SET_CONFERENCE_MEETING_INTEGRATION_INSTALLED':
			return state.set('isConferenceMeetingIntegrationInstalled', action.value);
		default:
			return state;
	}
};
