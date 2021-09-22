export const TRACK_METRICS = 'TRACK_METRICS';
export const VIEW = 'pipeline-viewer';
export const UPSELLING = {
	DISPLAYED: {
		component: 'regular_user_seat_popup',
		eventAction: 'displayed',
	},
	DECLINED: {
		component: 'regular_user_seat_request',
		eventAction: 'declined',
	},
	REQUESTED: {
		component: 'regular_user_seat',
		eventAction: 'requested',
	},
};

interface TrackUpsellingProps {
	component: string;
	eventAction: string;
}
export function trackUpselling({ component, eventAction }: TrackUpsellingProps) {
	return {
		type: TRACK_METRICS,
		pdMetrics: {
			component,
			eventAction,
		},
	};
}

export function trackOpen(hash: string, revoked: boolean) {
	return {
		type: TRACK_METRICS,
		pdMetrics: {
			component: 'shared_pipeline',
			eventAction: 'opened',
			eventData: {
				share_id: hash,
				access_revoked: revoked,
			},
		},
	};
}
