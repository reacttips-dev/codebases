import React from 'react';
import _ from 'lodash';
import { Icon } from '@pipedrive/convention-ui-react';

const mainType = 'new-activity';

const extendNewActivityInterface = (CalendarItemInterface) =>
	class ActivitiesInterface extends CalendarItemInterface {
		constructor(options = {}) {
			super({
				type: mainType,
			});

			this.getStateFromForm = options.getStateFromForm;
			this.updateMultipleFields = options.updateMultipleFields;
			this.activityTypes = options.activityTypes || [];
		}

		itemPostProcessing(item) {
			return item.set('ignoreIntersection', true);
		}

		getIconKey(activityType) {
			const selectedActivityType =
				this.activityTypes.find((type) => type.key_string === activityType) ||
				this.activityTypes.find((type) => type.active_flag);

			return selectedActivityType ? selectedActivityType.icon_key : activityType;
		}

		getColor() {
			return 'dark-blue';
		}

		async getItems() {
			return null;
		}

		async onItemAdd(data) {
			return data;
		}

		async onItemUpdate(item) {
			const data = item.get('data');

			this.updateMultipleFields({
				duration: data.get('duration'),
				dueTime: data.get('due_time'),
				dueDate: data.get('due_date'),
			});

			return null;
		}

		async onItemRemove() {
			return null;
		}

		async onItemClick() {
			return null;
		}

		async onGridClick({ date, time, updateCalendarItem }) {
			const activityType = this.activityTypes.find((item) => item.active_flag);
			const oldData = this.getStateFromForm();
			const data = {
				subject: oldData.subject,
				type: oldData.type || activityType,
				due_date: date,
				due_time: time,
				duration: oldData.duration || '00:30',
			};

			const activity = updateCalendarItem({
				id: `${mainType}.${oldData.id}`,
				type: mainType,
				data,
			});

			this.updateMultipleFields(_.mapKeys(data, (value, key) => _.camelCase(key)));

			return activity;
		}

		renderLeftAside({ item }) {
			return (
				<Icon
					icon={`ac-${this.getIconKey(item.getIn(['data', 'type']))}`}
					size="s"
					color="white"
				/>
			);
		}

		renderSubject({ item }) {
			if (item.getIn(['data', 'subject'])) {
				return item.getIn(['data', 'subject']);
			}

			const activityType = this.activityTypes.find((item) => item.active_flag);
			const activityData = this.getStateFromForm();
			const selectedType = this.activityTypes.find(
				(type) => type.key_string === activityData.type,
			);

			return (selectedType && selectedType.name) || activityType.name;
		}
	};

export { extendNewActivityInterface };
