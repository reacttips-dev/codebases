import { events as seshetaEvents } from 'constants/sesheta.json';
import { events as amplitudeEvents } from 'constants/amplitude.json';

export const SUPPORT_SIDEBAR_TOGGLE = 'SUPPORT_SIDEBAR_TOGGLE';
export const SUPPORT_GETTING_STARTED_CLICKED = 'SUPPORT_GETTING_STARTED_CLICKED';
export const SUPPORT_GETTING_STARTED_CLOSED = 'SUPPORT_GETTING_STARTED_CLOSED';
export const SUPPORT_GETTING_STARTED_OPENED = 'SUPPORT_GETTING_STARTED_OPENED';
export const SUPPORT_GETTING_STARTED_ITEM_CLICKED = 'SUPPORT_GETTING_STARTED_ITEM_CLICKED';
export const SUPPORT_GETTING_STARTED_ITEM_EXPANDED = 'SUPPORT_GETTING_STARTED_ITEM_EXPANDED';
export const SUPPORT_TALK_TO_US_CLICKED = 'SUPPORT_TALK_TO_US_CLICKED';
export const SUPPORT_LINK_CLICKED = 'SUPPORT_LINK_CLICKED';

export const gettingStartedClick = () => {
	return {
		type: SUPPORT_GETTING_STARTED_CLICKED,
		meta: {
			amplitude: {
				event: amplitudeEvents.sidebar.CLICKED_EXTERNAL_LINK,
				data: {
					link: 'getting_started',
				},
			},
		},
	};
};

export const gettingStartedItemClick = (type, url, GSVersion) => {
	return {
		type: SUPPORT_GETTING_STARTED_ITEM_CLICKED,
		meta: {
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

export const gettingStartedItemExpand = (GSVersion) => {
	return {
		type: SUPPORT_GETTING_STARTED_ITEM_EXPANDED,
		meta: {
			amplitude: {
				event: amplitudeEvents.getting_started
					.ITEM_EXPANDED_GETTING_STARTED,
				data: {
					...GSVersion,
				},
			},
		},
	};
};

export const gettingStartedClose = (GSVersion) => {
	return {
		type: SUPPORT_GETTING_STARTED_CLOSED,
		meta: {
			amplitude: {
				event: amplitudeEvents.getting_started
					.CLOSED_GETTING_STARTED,
				data: {
					...GSVersion,
				},
			},
		},
	};
};

export const gettingStartedOpen = (GSVersion) => {
	return {
		type: SUPPORT_GETTING_STARTED_OPENED,
		meta: {
			amplitude: {
				event: amplitudeEvents.getting_started.OPENED_GETTING_STARTED,
				data: {
					...GSVersion,
				},
			},
		},
	};
};

export const talkToUsClick = (source) => {
	return {
		type: SUPPORT_TALK_TO_US_CLICKED,
		meta: {
			sesheta: {
				name: seshetaEvents.talkToUs.CLICKED,
			},
			amplitude: {
				event: amplitudeEvents.sidebar.CLICKED_EXTERNAL_LINK,
				data: {
					link: 'chat',
					source,
				},
			},
		},
	};
};

export const externalLinkClick = (url, section, source) => {
	return {
		type: SUPPORT_LINK_CLICKED,
		meta: {
			sesheta: {
				name: seshetaEvents.externalLink.CLICKED,
				data: {
					link_url: url,
					source,
				},
			},
			amplitude: {
				event: amplitudeEvents.sidebar.CLICKED_EXTERNAL_LINK,
				data: {
					link: section,
					source,
				},
			},
		},
	};
};

export const toggle = (display, source = 'default') => {
	const seshetaEventName = display ? seshetaEvents.sidebar.OPENED : seshetaEvents.sidebar.CLOSED;
	const amplitudeEvent = display ? amplitudeEvents.sidebar.OPENED : amplitudeEvents.sidebar.CLOSED;

	return {
		type: SUPPORT_SIDEBAR_TOGGLE,
		display,
		meta: {
			sesheta: {
				name: seshetaEventName,
				data: {
					source,
				},
			},
			amplitude: {
				event: amplitudeEvent,
				data: {
					source,
				},
			},
		},
	};
};
