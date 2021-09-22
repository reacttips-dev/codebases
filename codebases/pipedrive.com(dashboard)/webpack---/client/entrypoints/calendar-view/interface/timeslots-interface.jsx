import React from 'react';
import moment from 'moment';
import { get as lget } from 'lodash';
import { Icon } from '@pipedrive/convention-ui-react';
import { get } from '@pipedrive/fetch';

const mainType = 'proposed-timeslots';

function timeslotsToCalendaritems(timeslots, events) {
	return timeslots
		.map((timeslot) => {
			const event = events.find((ev) => ev.id === timeslot.event_id);

			return {
				id: timeslot.id,
				subject: event.event_name,
				type: event.activity_type,
				due_date: timeslot.date,
				due_time: timeslot.time,
				duration: moment.duration(timeslot.duration, 'minutes'),
				activity_id: timeslot.activity_id,
				related_objects: { event },
			};
		})
		.filter((timeslot) => !timeslot.activity_id);
}

const extendTimeslotsInterface = (CalendarItemInterface) =>
	class TimeslotsInterface extends CalendarItemInterface {
		constructor() {
			super({
				type: mainType,
			});

			this.query = {
				userId: null,
			};

			this.socketHandler = this.socketHandler.bind(this);
		}

		getColor() {
			return 'dashed-grey';
		}

		isDraggable() {
			return false;
		}

		isResizable() {
			return false;
		}

		itemPostProcessing(item) {
			if (!item.getIn(['data', 'related_objects', 'event', 'is_active'])) {
				return null;
			}

			if (
				this.query.userId &&
				this.query.userId !== item.getIn(['data', 'related_objects', 'event', 'user_id'])
			) {
				return null;
			}

			return item;
		}

		socketHandler(event) {
			if (lget(event, 'alert_type') !== 'scheduler_event') {
				return;
			}

			const schedulerEvent = lget(event, 'current') || lget(event, 'previous');

			if (!schedulerEvent) {
				return;
			}

			this.calendarApi &&
				this.calendarApi.getItems(this.type).map((timeslot) => {
					const eventId = timeslot.getIn(['data', 'related_objects', 'event', 'id']);

					if (schedulerEvent.id === eventId) {
						this.calendarApi.removeItem(timeslot);
					}
				});

			if (!['added', 'updated'].includes(lget(event, 'alert_action'))) {
				return;
			}

			const timeslots = timeslotsToCalendaritems(schedulerEvent.timeslots, [schedulerEvent]);

			for (let index = 0; index < timeslots.length; index++) {
				this.addItem(timeslots[index]);
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
			this.query = query;

			if (!this.isListeningWebsocket) {
				this.webappApi.socketHandler.on('api.', this.socketHandler);
				this.isListeningWebsocket = true;
			}

			const response = await get('/api/v1/scheduler/timeslots', {
				queryParams: {
					start_date: query.startDate,
					end_date: query.endDate,
					is_active: true,
				},
			});

			const timeslots = timeslotsToCalendaritems(
				response.data,
				response.related_objects.events,
			);

			return includeRelatedObjects ? { data: timeslots } : timeslots;
		}

		renderLeftAside({ item }) {
			return (
				<Icon
					icon={`ac-${this.getIconKey(item.getIn(['data', 'type']))}`}
					size="s"
					color="black-88"
				/>
			);
		}

		destroy() {
			this.webappApi.socketHandler.off('api.', this.socketHandler);
		}
	};

export { extendTimeslotsInterface };
