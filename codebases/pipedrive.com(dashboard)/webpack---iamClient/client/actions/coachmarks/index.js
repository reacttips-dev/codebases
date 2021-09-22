import { find } from 'lodash';
import { events as amplitudeEvents } from 'constants/amplitude.json';
import trackedTags from 'constants/coachmarks/tracked.json';

export const COACHMARKS_REQUEST = 'COACHMARKS_REQUEST';
export const COACHMARKS_RECEIVE = 'COACHMARKS_RECEIVE';
export const COACHMARKS_READY = 'COACHMARKS_READY';
export const COACHMARKS_CLOSE = 'COACHMARKS_CLOSE';
export const COACHMARKS_NOTIFY = 'COACHMARKS_NOTIFY';
export const COACHMARKS_ENQUEUE = 'COACHMARKS_ENQUEUE';
export const COACHMARKS_UNQUEUE = 'COACHMARKS_UNQUEUE';
export const COACHMARKS_DROP_QUEUE = 'COACHMARKS_DROP_QUEUE';
export const COACHMARKS_SUPPRESS = 'COACHMARKS_SUPPRESS';

const ready = (tag, type, viewedType, important) => {
	let action = {
		type: COACHMARKS_READY,
		tag,
	};

	if (trackedTags.includes(tag)) {
		action = {
			...action,
			meta: {
				amplitude: {
					event: amplitudeEvents.coach_mark.SEEN,
					data: {
						tag,
						type,
						viewed_type: viewedType,
						important_flag: important,
					},
				},
			},
		};
	}

	return action;
};

const close = (tag, type, viewedType, important, cta = null) => {
	let action = {
		type: COACHMARKS_CLOSE,
		tag,
	};

	if (trackedTags.includes(tag)) {
		const amplitudeData = {
			tag,
			type,
			viewed_type: viewedType,
			important_flag: important,
		};

		if (cta) {
			amplitudeData.call_to_action = cta;
		}

		action = {
			...action,
			meta: {
				amplitude: {
					event: amplitudeEvents.coach_mark.CLOSED,
					data: amplitudeData,
				},
			},
		};
	}

	return action;
};

export const notifyServer = (tag) => {
	const fetch = {
		request: {
			endpoint: `/api/v1/coach-marks-api/coach-marks/${tag}`,
			method: 'POST',
		},
	};

	return {
		type: COACHMARKS_NOTIFY,
		meta: {
			fetch,
			logger: {
				remote: `Marking CoachMark closed ${tag}`,
			},
		},
		tag,
	};
};

export const receive = (results) => {
	return {
		type: COACHMARKS_RECEIVE,
		results,
	};
};

export const request = (userCreationDate, companyCreationDate) => {
	const request = {
		endpoint: `/api/v1/coach-marks-api/coach-marks`,
		method: 'GET',
		params: {
			userCreationDate,
			companyCreationDate,
		},
	};

	return {
		type: COACHMARKS_REQUEST,
		meta: {
			fetch: {
				request,
				success: receive,
			},
		},
	};
};

export const enqueue = (tag) => {
	return {
		type: COACHMARKS_ENQUEUE,
		tag,
	};
};

export const unqueue = (tag) => {
	return {
		type: COACHMARKS_UNQUEUE,
		tag,
	};
};

export const dropQueue = () => {
	return {
		type: COACHMARKS_DROP_QUEUE,
	};
};

export const requestWithUserDetails = () => (dispatch, getState) => {
	const userCreationDate = getState().user.userCreationDate;
	const companyCreationDate = getState().user.companyCreationDate;

	return dispatch(request(userCreationDate, companyCreationDate));
};

export const notifyReadyWithDetails = (tag) => (dispatch, getState) => {
	const cm = find(getState().coachmarks.all, { tag });

	dispatch(ready(tag, cm.type, cm.viewedType, cm.important));
};

export const closeAndPossiblyNotify = (tag, debug, cta) => (dispatch, getState) => {
	const cm = find(getState().coachmarks.all, { tag });

	if (!cm) {
		return;
	}

	dispatch(close(tag, cm.type, cm.viewedType, cm.important, cta));

	if (!cm.isSavedInServer && !debug) {
		return dispatch(notifyServer(tag));
	}
};

export const suppress = (suppressed) => {
	return {
		type: COACHMARKS_SUPPRESS,
		suppressed,
	};
};
