import { SocketActivity, SocketEvent } from 'Types/types';
import { toNodeId_DO_NOT_USE } from 'Utils/graphql/toNodeId';
import { GraphQLResponseWithData } from '@pipedrive/relay';

const isLeadActivity = (item: SocketActivity | null): item is SocketActivity => Boolean(item && item.lead_id);

const isActivityEvent = (
	event: SocketEvent<SocketActivity | Record<string, unknown>>,
): event is SocketEvent<SocketActivity> => event.alert_type === 'activity';

const getTime = (time: string | null) => (time ? `${time}:00Z` : null);

export const activityHandler = (socketHandler: Backbone.Events, cb: (data: GraphQLResponseWithData) => void) =>
	socketHandler.on('api.', (event: SocketEvent) => {
		if (isActivityEvent(event) && isLeadActivity(event.current)) {
			const activity = event.current;

			const lead = activity.lead_id
				? {
						id: toNodeId_DO_NOT_USE('Lead', activity.lead_id),
						legacyID: activity.lead_id,
				  }
				: null;

			if (!lead) {
				return;
			}

			return cb({
				data: {
					INTERNAL__webapp: {
						activity: {
							id: toNodeId_DO_NOT_USE('Activity', activity.id),
							legacyID: activity.id,
							subject: activity.subject,
							lead,
							type: activity.type,
							note: activity.note,
							userId: activity.user_id,
							dueDate: activity.due_date,
							dueTime: getTime(activity.due_time),
							isDone: activity.done,
						},
					},
				},
			});
		}
	});
