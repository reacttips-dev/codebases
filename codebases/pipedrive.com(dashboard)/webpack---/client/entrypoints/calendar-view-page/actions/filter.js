import { getFilterFromUrl } from '../../../utils/filter';

function setActiveFilter(activeFilter) {
	return {
		type: 'ACTIVE_FILTER',
		activeFilter,
	};
}

export function updateActiveFilter(webappApi, calendarViewUrl, { type, value }) {
	return async (dispatch) => {
		webappApi.router.go(
			null,
			`${calendarViewUrl}/${type}/${value}${location.hash}`,
			true,
			true,
		);

		dispatch(setActiveFilter({ type, value }));
	};
}

export function initActiveFilter(webappApi, calendarViewUrl) {
	return async (dispatch) => {
		let activeFilter;

		const filterFromUrl = getFilterFromUrl();

		if (filterFromUrl) {
			activeFilter = filterFromUrl;
		} else {
			activeFilter = {
				type: 'user',
				value: webappApi.userSelf.get('id'),
			};
		}

		dispatch(updateActiveFilter(webappApi, calendarViewUrl, activeFilter));
	};
}
