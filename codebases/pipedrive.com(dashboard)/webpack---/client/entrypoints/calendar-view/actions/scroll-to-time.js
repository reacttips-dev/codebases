/**
 * @param {string} scrollToTime utc moment HH:mm string
 */
export function setScrollToTime(scrollToTime = null) {
	return {
		type: 'CALENDAR_SCROLL_TO_TIME',
		scrollToTime,
	};
}
