import React from 'react';
import moment from 'moment';
import { get as lget } from 'lodash';

import { calendarItemClicked, activityQuickAdded } from '../../../utils/track-usage';
import { post } from '@pipedrive/fetch';
import { prepareActivityData } from '../../../utils/activity';
import {
	generateRecurringActivities,
	removeRecurringActivities,
} from '../utils/recurring-activity';
import CalendarItemIcon from '../components/calendar-item-icon';
import MarkAsDoneCheckBox from '../components/mark-as-done-checkbox';
import RecurringActivity from '../components/recurring-activity';
import ActivityInProgress from '../components/activity-in-progress';
import {
	getActivitiesBasedOnQuery,
	updateActivity,
	getNewActivityOptions,
	getQuickAddTrackingParams,
} from '../utils/activity';

const mainType = 'activity';

const extendActivitiesInterface = (CalendarItemInterface) =>
	class ActivitiesInterface extends CalendarItemInterface {
		constructor({ isTooltipsVisible = true } = {}) {
			super({ type: mainType });

			this.query = {
				userId: null,
				type: '',
			};
			this.isTooltipsVisible = isTooltipsVisible;
			this.socketHandler = this.socketHandler.bind(this);
			this.removeItem = this.removeItem.bind(this);
		}

		getColor(item) {
			if (item.get('masterActivityId') || item.get('data').get('rec_master_activity_id')) {
				return 'grey';
			}

			return item.get('isPreview') || item.get('isDragging') ? 'dark-blue' : 'light-blue';
		}

		isDraggable(item) {
			return !(
				item.get('masterActivityId') ||
				item.get('data').get('rec_master_activity_id') ||
				item.get('isRequestPending')
			);
		}

		isResizable(item) {
			return this.isDraggable(item);
		}

		itemPostProcessing(item) {
			if (item.get('isAdding')) {
				return item;
			}

			if (this.query.userId && this.query.userId !== item.getIn(['data', 'user_id'])) {
				return null;
			}

			if (this.query.type && !this.query.type.includes(item.getIn(['data', 'type']))) {
				return null;
			}

			if (
				item.getIn(['data', 'rec_rule']) &&
				!(item.get('masterActivityId') || item.get('data').get('rec_master_activity_id'))
			) {
				setTimeout(
					() =>
						generateRecurringActivities({
							item,
							mainType,
							calendarApi: this.calendarApi,
							startDate: this.startDate,
							endDate: this.endDate,
							removeItem: this.removeItem,
						}),
					10,
				);

				return null;
			}

			return item;
		}

		socketHandler(event) {
			if (lget(event, 'alert_type') !== this.type) {
				return null;
			}

			const activity = lget(event, 'current') || lget(event, 'previous');
			const relatedObjects = lget(event, 'related_objects');

			if (!activity) {
				return null;
			}

			switch (lget(event, 'alert_action')) {
				case 'added':
					return this.addItem(activity, relatedObjects);
				case 'updated':
					return activity.active_flag ? this.updateItem(activity, relatedObjects) : null;
				case 'deleted':
					return activity.rec_rule
						? removeRecurringActivities({
								activityId: activity.id,
								calendarApi: this.calendarApi,
								type: mainType,
								removeItem: this.removeItem,
						  })
						: this.removeItem(activity.id);
				default:
					return null;
			}
		}

		getIconKey(activityType) {
			return (
				this.webappApi.userSelf
					.get('activity_types')
					.find((type) => type.key_string === activityType) || {}
			).icon_key;
		}

		async getItems(query, includeRelatedObjects = false) {
			const requestStarted = moment();

			this.lastRequestStarted = requestStarted;
			this.query = query;
			this.startDate = moment.utc(query.startDate);
			this.endDate = moment.utc(query.endDate);

			if (!this.isListeningWebsocket) {
				this.webappApi.socketHandler.on('api.', this.socketHandler);
				this.isListeningWebsocket = true;
			}

			const response = await getActivitiesBasedOnQuery({
				startDate: this.startDate,
				endDate: this.endDate,
				query,
			});

			if (requestStarted.isBefore(this.lastRequestStarted)) {
				// This request is no longer relevant as another request has already been initiated.
				return null;
			}

			const { data, related_objects: relatedObjects } = response;
			const responseData = data || [];

			return includeRelatedObjects ? { data: responseData, relatedObjects } : responseData;
		}

		getRelatedObjects() {
			return this.calendarApi.getRelatedObjects();
		}

		async onItemAdd(item) {
			const response = await post('/api/v1/activities', prepareActivityData(item, true));
			const { data } = response;

			activityQuickAdded(
				this.webappApi,
				getQuickAddTrackingParams({ data, webappApi: this.webappApi }),
			);

			return item.mergeDeep({
				isAdding: false,
				isPreview: false,
				ignoreIntersection: false,
				isRequestPending: false,
				data,
			});
		}

		async onItemUpdate(item) {
			if (item.get('isPreview')) {
				return false;
			}

			const response = await updateActivity(item);

			response.data.additional_data = response.additional_data;
			response.data.related_objects = response.related_objects;

			return item.mergeDeep({ data: response.data });
		}

		async onItemRemove() {
			return null;
		}

		async onItemClick({ event, item }) {
			event.stopPropagation();

			if (
				item.get('isAdding') ||
				item.get('masterActivityId') ||
				item.get('data').get('rec_master_activity_id')
			) {
				return;
			}

			this.webappApi.router.go(null, '#dialog/activity/edit', false, false, {
				activity: item.getIn(['data', 'id']),
			});
			calendarItemClicked(this.webappApi, item);
		}

		async onGridClick({ userId, date, time, updateCalendarItem }) {
			const activityTypes = this.webappApi.userSelf.get('activity_types');
			const activityType = activityTypes.find((item) => item.active_flag);

			return updateCalendarItem(
				getNewActivityOptions({ mainType, activityType, date, time, userId }),
			);
		}

		renderLeftAside({ item }) {
			return (
				<CalendarItemIcon
					item={item}
					iconKey={this.getIconKey(item.getIn(['data', 'type']))}
				/>
			);
		}

		renderRightAside({ item, date, updateThisItem }) {
			return <MarkAsDoneCheckBox item={item} date={date} updateThisItem={updateThisItem} />;
		}

		renderItem({ item, children, addThisItem, updateThisItem, removeThisItem }) {
			if (
				this.isTooltipsVisible &&
				(item.get('masterActivityId') || item.get('data').get('rec_master_activity_id'))
			) {
				return <RecurringActivity>{children}</RecurringActivity>;
			}

			if (item.get('isAdding') && !item.get('isDragging')) {
				return (
					<ActivityInProgress
						item={item}
						addThisItem={addThisItem}
						updateThisItem={updateThisItem}
						removeThisItem={removeThisItem}
					>
						{children}
					</ActivityInProgress>
				);
			}

			return null;
		}

		destroy() {
			this.webappApi.socketHandler.off('api.', this.socketHandler);
		}
	};

export { extendActivitiesInterface };
