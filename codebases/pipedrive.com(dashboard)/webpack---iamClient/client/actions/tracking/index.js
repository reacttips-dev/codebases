export const TRACKING_TRACK = 'TRACKING_TRACK';

export const track = (eventName, data) => {
	return {
		type: TRACKING_TRACK,
		meta: {
			sesheta: {
				name: eventName,
				data,
			},
		},
	};
};
