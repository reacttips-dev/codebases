export function updateCalendarQuery(query = null) {
	return {
		type: 'CALENDAR_QUERY',
		query,
	};
}
