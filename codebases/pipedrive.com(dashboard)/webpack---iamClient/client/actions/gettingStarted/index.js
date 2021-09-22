import routes from 'constants/gettingStarted/routes.json';
import { isArray, isObject } from 'lodash';
import { events as amplitudeEvents } from 'constants/amplitude.json';
import { events as seshetaEvents } from 'constants/sesheta.json';

export const GETTINGSTARTED_TOGGLE = 'GETTINGSTARTED_TOGGLE';
export const GETTINGSTARTED_SKIP = 'GETTINGSTARTED_SKIP';
export const GETTINGSTARTED_HIDE = 'GETTINGSTARTED_HIDE';
export const GETTINGSTARTED_ARTICLE_REQUEST = 'GETTINGSTARTED_ARTICLE_REQUEST';
export const GETTINGSTARTED_ARTICLE_RECEIVE = 'GETTINGSTARTED_ARTICLE_RECEIVE';
export const GETTINGSTARTED_SAVE_WIDTH = 'GETTINGSTARTED_SAVE_WIDTH';
export const GETTINGSTARTED_GET_COMPLETED_STAGES = 'GETTINGSTARTED_GET_COMPLETED_STAGES';
export const GETTINGSTARTED_COMPLETE_STAGE = 'GETTINGSTARTED_COMPLETE_STAGE';
export const GETTINGSTARTED_SAVE_STAGE = 'GETTINGSTARTED_SAVE_STAGE';
export const GETTING_STARTED_REOPENED = 'GETTING_STARTED_REOPENED';
export const GETTING_STARTED_MINIMIZED = 'GETTING_STARTED_MINIMIZED';
export const GETTING_STARTED_MAXIMIZED = 'GETTING_STARTED_MAXIMIZED';
export const GETTING_STARTED_CLOSED = 'GETTING_STARTED_CLOSED';
export const GETTING_STARTED_ITEM_CLICKED = 'GETTING_STARTED_ITEM_CLICKED';
export const GETTINGSTARTED_SUPPRESS = 'GETTINGSTARTED_SUPPRESS';

export const toggle = (displaySidebar) => {
	return {
		type: GETTINGSTARTED_TOGGLE,
		displaySidebar,
	};
};

export const saveSidebarWidth = (width) => {
	return {
		type: GETTINGSTARTED_SAVE_WIDTH,
		width,
	};
};

export const skip = () => {
	return {
		type: GETTINGSTARTED_SKIP,
	};
};

export const hide = () => {
	return {
		type: GETTINGSTARTED_HIDE,
	};
};

export const articleReceive = (article) => {
	return {
		type: GETTINGSTARTED_ARTICLE_RECEIVE,
		article,
	};
};

export const getArticleById = (id, locale) => {
	const request = {
		endpoint: `/api/v1/kb-api/support-articles/${id}/${locale}`,
		method: 'GET',
	};

	return {
		type: GETTINGSTARTED_ARTICLE_REQUEST,
		meta: {
			route: {
				pathname: `${routes.ARTICLE}/${id}/${locale}`,
			},
			fetch: {
				request,
				success: articleReceive,
			},
		},
	};
};

export const getArticle = (id) => (dispatch, getState) => {
	const userLang = getState().user.userLang;

	return dispatch(getArticleById(id, userLang));
};

export const completeStage = (stageName) => {
	let stages = [stageName];

	if (isArray(stageName)) {
		stages = stageName;
	} else if (isObject(stageName)) {
		stages = Object.values(stageName);
	}

	return {
		type: GETTINGSTARTED_COMPLETE_STAGE,
		stages,
	};
};

export const getCompletedStages = () => {
	const request = {
		endpoint: `/api/v1/getting-started-api/getting-started`,
		method: 'GET',
	};

	return {
		type: GETTINGSTARTED_GET_COMPLETED_STAGES,
		meta: {
			fetch: {
				request,
				success: completeStage,
			},
		},
	};
};

export const saveCompletedStage = (stageName) => {
	const request = {
		endpoint: `/api/v1/getting-started-api/getting-started`,
		method: 'POST',
		params: {
			action: stageName,
		},
	};

	return {
		type: GETTINGSTARTED_SAVE_STAGE,
		meta: {
			fetch: {
				request,
			},
		},
	};
};

export const gettingStartedReopened = () => {
	return {
		type: GETTING_STARTED_REOPENED,
		meta: {
			amplitude: {
				event: amplitudeEvents.getting_started.REOPENED_GETTING_STARTED,
				data: {
					type: 'reopened',
				},
			},
		},
	};
};

export const gettingStartedMinimized = () => {
	return {
		type: GETTING_STARTED_MINIMIZED,
		meta: {
			amplitude: {
				event: amplitudeEvents.getting_started.MINIMIZED_GETTING_STARTED,
			},
		},
	};
};

export const gettingStartedMaximized = () => {
	return {
		type: GETTING_STARTED_MAXIMIZED,
		meta: {
			amplitude: {
				event: amplitudeEvents.getting_started.MAXIMIZED_GETTING_STARTED,
			},
			sesheta: {
				name: seshetaEvents.gettingStarted.OPENED,
			},
		},
	};
};

export const gettingStartedClosed = (isMaximized, panelCollapsed) => {
	return {
		type: GETTING_STARTED_CLOSED,
		meta: {
			sesheta: {
				name: seshetaEvents.gettingStarted.HIDDEN,
				data: panelCollapsed,
			},
			amplitude: {
				event: amplitudeEvents.getting_started.CLOSED_GETTING_STARTED,
				data: {
					state: isMaximized ? 'maximized' : 'minimized',
				},
			},
		},
	};
};

export const gettingStartedItemClicked = (statistics, type, url, GSVersion) => {
	return {
		type: GETTING_STARTED_ITEM_CLICKED,
		meta: {
			sesheta: {
				name: seshetaEvents.gettingStarted.STAGE_CLICKED,
				data: statistics,
			},
			amplitude: {
				event: amplitudeEvents.getting_started.ITEM_CLICKED_GETTING_STARTED,
				data: {
					type,
					url,
					...GSVersion,
				},
			},
		},
	};
};

export const suppressGettingStarted = (suppressed) => {
	return {
		type: GETTINGSTARTED_SUPPRESS,
		suppressed,
	};
};
