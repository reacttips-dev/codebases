export function extendExistingActivityInterface(ActivityInterface) {
	return class CustomActivitiesInterface extends ActivityInterface {
		constructor({ getStateFromForm }) {
			super({ isTooltipsVisible: false, type: 'new-activity' });

			this.getStateFromForm = getStateFromForm;
		}

		itemPostProcessing(...args) {
			const item = super.itemPostProcessing(...args);

			if (!item) {
				return null;
			}

			if (this.getStateFromForm().id === item.getIn(['data', 'id'])) {
				return null;
			}

			return item;
		}

		isDraggable() {
			return false;
		}

		isResizable() {
			return false;
		}

		onItemClick() {
			return null;
		}

		renderRightAside() {
			return null;
		}

		getColor() {
			return 'grey';
		}
	};
}
