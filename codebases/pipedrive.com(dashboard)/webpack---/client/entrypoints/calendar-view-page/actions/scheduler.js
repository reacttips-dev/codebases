export function selectSchedulerEvent(eventId) {
	return {
		type: 'SELECT_SCHEDULER_EVENT',
		eventId,
	};
}
