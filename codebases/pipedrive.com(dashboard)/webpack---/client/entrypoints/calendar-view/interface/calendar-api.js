import { CalendarItemInterface } from './calendar-item-interface';
import { uniqueId, get } from 'lodash';
import * as Immutable from 'immutable';
import {
	updateCalendarItem,
	removeCalendarItem,
	removeCalendarItemForType,
	updateCalendarItemsForType,
	getCalendarItem,
	getAllCalendarItems,
	setCalendarPeriod,
	updateRelatedObjects,
} from '../actions/calendar';
import { setScrollToTime } from '../actions/scroll-to-time';
import { updateCalendarQuery } from '../actions/query';

const STORE = Symbol('store');
const INTERFACES = Symbol('interfaces');

export class CalendarApi {
	constructor(interfaces, mainType, store, webappApi, translator) {
		this[INTERFACES] = interfaces;
		this.mainType = mainType;
		this[STORE] = store;

		for (let index = 0; index < interfaces.length; index++) {
			if (!(interfaces[index] instanceof CalendarItemInterface)) {
				throw new Error('Calendar interface must be instance of "CalendarItemInterface"');
			}

			this[INTERFACES][index].calendarApi = this;
			this[INTERFACES][index].webappApi = webappApi;
			this[INTERFACES][index].translator = translator;
		}
	}

	getInterface(type) {
		return this[INTERFACES].find((typeInterface) => typeInterface.getType() === type);
	}

	getColor(item) {
		return this.callItemInterfaceMethod(item, 'getColor', item);
	}

	getCustomClassName(item) {
		return this.callItemInterfaceMethod(item, 'getCustomClassName', item);
	}

	getItems(type) {
		return this[STORE].dispatch(getAllCalendarItems(type));
	}

	getItem(id) {
		return this[STORE].dispatch(getCalendarItem(id));
	}

	getInterfaceForItem(item) {
		return (
			item &&
			this.getInterface(
				typeof item === 'string' ? item : item.get('type') || item.get('id').split('.')[0],
			)
		);
	}

	callItemInterfaceMethod(item, method, args) {
		const api = this.getInterfaceForItem(item);

		if (!(api && api[method])) {
			return null;
		}

		return api[method](args);
	}

	processItem(item) {
		item = Immutable.Map.isMap(item) ? item : Immutable.fromJS(item);

		const api = this.getInterfaceForItem(item);

		return api ? api.itemPostProcessing(item) : null;
	}

	isDraggable(item) {
		const api = this.getInterfaceForItem(item);

		return item.get('isDraggable') !== false && !!(api && api.isDraggable(item));
	}

	isResizable(item) {
		const api = this.getInterfaceForItem(item);

		return item.get('isResizable') !== false && !!(api && api.isResizable(item));
	}

	setItemsForType(type, items) {
		if (items) {
			items = Immutable.List.isList(items) ? items : Immutable.fromJS(items);

			items = items.reduce((result, item) => {
				if (!item) {
					return result;
				}

				return result.push(
					this.processItem(
						new Immutable.Map({
							id: `${type}.${item.get('id')}`,
							type,
							data: item,
						}),
					),
				);
			}, new Immutable.List());
		}

		return this[STORE].dispatch(updateCalendarItemsForType(type, items));
	}

	updateItemForType(type, item) {
		item = Immutable.Map.isMap(item) ? item : Immutable.fromJS(item);

		return this[STORE].dispatch(
			updateCalendarItem(
				this.processItem(
					new Immutable.Map({
						id: `${type}.${item.get('id')}`,
						type,
						data: item,
					}),
				),
			),
		);
	}

	removeItemForType(type, id) {
		return this[STORE].dispatch(removeCalendarItemForType(type, id));
	}

	updateRelatedObjects(relatedObjects) {
		if (relatedObjects) {
			this[STORE].dispatch(updateRelatedObjects(Immutable.fromJS(relatedObjects)));
		}
	}

	getRelatedObjects() {
		return this[STORE].getState().getIn(['calendar', 'relatedObjects']);
	}

	addOrUpdateItemSilently(item) {
		item = Immutable.Map.isMap(item) ? item : Immutable.fromJS(item);

		const originalItem = this[STORE].dispatch(getCalendarItem(item.get('id')));

		if (originalItem) {
			item = originalItem.merge(item);
		}

		item = this[STORE].dispatch(updateCalendarItem(this.processItem(item)));

		return item;
	}

	async addItem(item) {
		item = Immutable.Map.isMap(item) ? item : Immutable.fromJS(item);

		const tempId = uniqueId(item.get('id'));

		this[STORE].dispatch(
			updateCalendarItem(this.processItem(item.merge({ id: tempId, isDraggable: false }))),
		);
		this[STORE].dispatch(removeCalendarItem(item.get('id')));

		try {
			const savedItem = await this.callItemInterfaceMethod(item, 'onItemAdd', item);

			this[STORE].dispatch(removeCalendarItem(tempId));

			if (savedItem) {
				item = this[STORE].dispatch(
					updateCalendarItem(
						this.processItem(
							savedItem.merge({
								id: `${item.get('type')}.${savedItem.getIn(['data', 'id'])}`,
								type: item.get('type'),
							}),
						),
					),
				);
			} else {
				item = this[STORE].dispatch(updateCalendarItem(this.processItem(item)));
			}
		} catch (error) {
			this[STORE].dispatch(removeCalendarItem(tempId));

			throw error;
		}

		if (!item) {
			this[STORE].dispatch(removeCalendarItem(tempId));

			return null;
		}

		return item;
	}

	async updateItem(item) {
		item = Immutable.Map.isMap(item) ? item : Immutable.fromJS(item);

		const originalItem = this[STORE].dispatch(getCalendarItem(item.get('id')));

		item = this[STORE].dispatch(
			updateCalendarItem(
				this.processItem(originalItem ? originalItem.mergeDeep(item) : item),
			),
		);

		if (!item) {
			return null;
		}

		try {
			const data = await this.callItemInterfaceMethod(item, 'onItemUpdate', item);

			if (data) {
				item = this[STORE].dispatch(updateCalendarItem(this.processItem(data)));
			}
		} catch (error) {
			this[STORE].dispatch(updateCalendarItem(originalItem));

			throw error;
		}

		if (!item) {
			return this[STORE].dispatch(updateCalendarItem(originalItem));
		}

		return item;
	}

	async removeItem(item) {
		const id = Immutable.Map.isMap(item) ? item.get('id') : get(item, 'id', item);

		const originalItem = this[STORE].dispatch(getCalendarItem(id));

		item = this[STORE].dispatch(removeCalendarItem(id));

		if (!item) {
			return null;
		}

		try {
			await this.callItemInterfaceMethod(item, 'onItemRemove', item);
		} catch (error) {
			this[STORE].dispatch(updateCalendarItem(originalItem));

			throw error;
		}

		return item;
	}

	async removeAll(type = this.mainType) {
		const originalItems = this[STORE].dispatch(getAllCalendarItems(type));

		this[STORE].dispatch(updateCalendarItemsForType(type, []));

		try {
			await this.callItemInterfaceMethod(type, 'onAllRemove', originalItems);
		} catch (error) {
			this[STORE].dispatch(updateCalendarItemsForType(type, originalItems));

			throw error;
		}

		return originalItems;
	}

	onGridClick({ event, context, date, time }) {
		return this.callItemInterfaceMethod(this.mainType, 'onGridClick', {
			event,
			context,
			date,
			time,
			addCalendarItem: (item) => this.addOrUpdateItemSilently(item),
			updateCalendarItem: (item) => this.addOrUpdateItemSilently(item),
			removeCalendarItem: (id) => this[STORE].dispatch(removeCalendarItem(id)),
		});
	}

	onItemClick({ event, item }) {
		return this.callItemInterfaceMethod(item, 'onItemClick', {
			...this.composeRenderProps(item),
			event,
		});
	}

	renderSubject(item, props) {
		return this.callItemInterfaceMethod(
			item,
			'renderSubject',
			this.composeRenderProps(item, props),
		);
	}

	renderLeftAside(item, props) {
		return this.callItemInterfaceMethod(
			item,
			'renderLeftAside',
			this.composeRenderProps(item, props),
		);
	}

	renderRightAside(item, props) {
		return this.callItemInterfaceMethod(
			item,
			'renderRightAside',
			this.composeRenderProps(item, props),
		);
	}

	renderItem(item, props) {
		return this.callItemInterfaceMethod(
			item,
			'renderItem',
			this.composeRenderProps(item, props),
		);
	}

	composeRenderProps(item, props) {
		return {
			...props,
			item,
			addThisItem: (addedItem) => this.addItem(addedItem.set('id', item.get('id'))),
			updateThisItem: (updatedItem) => this.updateItem(updatedItem.set('id', item.get('id'))),
			removeThisItem: () => this.removeItem(item),
		};
	}

	destroy() {
		for (let index = 0; index < this[INTERFACES].length; index++) {
			delete this[INTERFACES][index].calendarApi;
		}
	}

	scrollTo(time) {
		return this[STORE].dispatch(setScrollToTime(time));
	}

	setCalendarPeriod({ periodInDays, startDate }) {
		return this[STORE].dispatch(setCalendarPeriod(periodInDays, startDate));
	}

	updateCalendarQuery(query) {
		return this[STORE].dispatch(updateCalendarQuery(query));
	}
}
