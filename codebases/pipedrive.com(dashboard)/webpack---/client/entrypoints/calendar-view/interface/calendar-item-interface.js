export class CalendarItemInterface {
	constructor({ type, color = 'light-blue' }) {
		if (!type) {
			throw new Error('Type is needed for calendar item interface');
		}

		this.type = type;
		this.color = color;
		this.calendarApi = null;
		this.webappApi = null;
	}

	getType() {
		return this.type;
	}

	getColor() {
		return this.color;
	}

	itemPostProcessing(item) {
		return item;
	}

	setItems(items, relatedObjects) {
		if (this.calendarApi) {
			this.calendarApi.setItemsForType(this.type, items);
			this.calendarApi.updateRelatedObjects(relatedObjects);
		}
	}

	addUpdateItem(item, relatedObjects) {
		if (this.calendarApi) {
			this.calendarApi.updateItemForType(this.type, item);
			this.calendarApi.updateRelatedObjects(relatedObjects);
		}
	}

	addItem(item, relatedObjects) {
		this.addUpdateItem(item, relatedObjects);
	}

	updateItem(item, relatedObjects) {
		this.addUpdateItem(item, relatedObjects);
	}

	removeItem(id) {
		this.calendarApi && this.calendarApi.removeItemForType(this.type, id);
	}

	isResizable() {
		return true;
	}

	isDraggable() {
		return true;
	}

	renderItem({ children }) {
		return children;
	}

	renderSubject({ item }) {
		return item.getIn(['data', 'subject']);
	}

	// async onItemAdd() {}

	// async onItemUpdate() {}

	// async onItemRemove() {}

	destroy() {}
}
