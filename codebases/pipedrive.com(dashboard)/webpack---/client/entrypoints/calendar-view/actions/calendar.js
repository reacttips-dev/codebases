import * as Immutable from 'immutable';
import { getCalendarDays } from '../../../utils/date';
import { UTC_DATETIME_FORMAT } from '../../../config/constants';

const setAlldayCollapse = (isAlldayCollapsed = true) => ({
	type: 'CALENDAR_ALLDAY_COLLAPSE',
	isAlldayCollapsed,
});

const updateDates = ({ startDate, endDate, daysNumber }) => ({
	type: 'UPDATE_DATES',
	startDate,
	endDate,
	daysNumber,
});

export function getCalendarItem(id) {
	return (dispatch, getState) => {
		return getState()
			.getIn(['calendar', 'items'])
			.find((item) => item.get('id') === id);
	};
}

export function getAllCalendarItems(type) {
	return (dispatch, getState) => {
		let allItems = getState().getIn(['calendar', 'items']);

		if (type) {
			allItems = allItems.filter((item) => item.get('type') === type);
		}

		return allItems;
	};
}

export function updateCalendarItem(data) {
	return (dispatch) => {
		if (!data) {
			return null;
		}

		data = Immutable.Map.isMap(data) ? data : Immutable.fromJS(data);

		dispatch({
			type: 'CALENDAR_UPDATE_ITEM',
			data,
		});

		if (data.hasIn(['data', 'related_objects'])) {
			dispatch(updateRelatedObjects(data.getIn(['data', 'related_objects'])));
		}

		return dispatch(getCalendarItem(data.get('id')));
	};
}

export function removeCalendarItem(id) {
	return (dispatch) => {
		const item = dispatch(getCalendarItem(id));

		dispatch({
			type: 'CALENDAR_REMOVE_ITEM',
			id,
		});

		return item;
	};
}

export function removeCalendarItemForType(type, id) {
	return (dispatch) => dispatch(removeCalendarItem(`${type}.${id}`));
}

export function updateCalendarItemsForType(itemsType, items) {
	return (dispatch) => {
		if (items === null) {
			return null;
		}

		return dispatch({
			type: 'CALENDAR_ITEMS',
			itemsType,
			items,
		});
	};
}

export function updateRelatedObjects(relatedObjects) {
	return {
		type: 'CALENDAR_UPDATE_RELATED_OBJECTS',
		relatedObjects,
	};
}

export function toggleAlldayCollapse(isAlldayCollapsed = null) {
	return (dispatch, getState) => {
		const isAlldayCollapsedCurrently = getState().getIn(['calendar', 'isAlldayCollapsed']);
		const newState =
			isAlldayCollapsed === null ? !isAlldayCollapsedCurrently : !!isAlldayCollapsed;

		return dispatch(setAlldayCollapse(newState));
	};
}

export function setCalendarPeriod(daysNumber, date) {
	return (dispatch) => {
		const { startDate, endDate } = getCalendarDays(daysNumber, date, true);

		return dispatch(
			updateDates({
				startDate: startDate.format(UTC_DATETIME_FORMAT),
				endDate: endDate.format(UTC_DATETIME_FORMAT),
				daysNumber,
			}),
		);
	};
}

export function setCurrentDraggableItem(currentDraggableItem = null) {
	return {
		type: 'CALENDAR_CURRENT_DRAGGABLE_ITEM',
		currentDraggableItem,
	};
}

export function setCurrentResizingItem(currentResizingItem = null) {
	return {
		type: 'CALENDAR_CURRENT_RESIZING_ITEM',
		currentResizingItem,
	};
}
