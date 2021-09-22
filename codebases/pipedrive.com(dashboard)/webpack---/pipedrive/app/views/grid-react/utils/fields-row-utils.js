const FieldsRowUtils = {
	getActivityRowClass(model) {
		let result = '';

		if (model.isDone()) {
			result = 'gridRow--strikethrough';
		} else if (model.isOverdueCached) {
			result = 'gridRow--red';
		} else if (model.isTodayCached) {
			result = 'gridRow--green';
		}

		return result;
	},

	getDealRowClass(model) {
		const status = model.get('status');

		let result = '';

		if (status === 'won') {
			result = 'gridRow--green';
		} else if (status === 'lost') {
			result = 'gridRow--red';
		}

		return result;
	},

	getRowClass(model) {
		let result = '';

		if (model && model.type === 'deal') {
			result = this.getDealRowClass(model);
		} else if (model && model.type === 'activity') {
			result = this.getActivityRowClass(model);
		}

		return result;
	},

	isRowInVerticalViewPort(rowElement, containerElement) {
		const boundingElement = rowElement.getBoundingClientRect();

		const boundingContainer = containerElement.getBoundingClientRect();

		return (
			boundingElement.top - boundingContainer.top > 0 &&
			boundingElement.bottom < (window.innerHeight || document.documentElement.clientHeight)
		);
	}
};

module.exports = FieldsRowUtils;
