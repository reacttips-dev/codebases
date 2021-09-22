import { graphql, readInlineData } from '@pipedrive/relay';

import type { labels_metrics_label_applied_lead$key } from './__generated__/labels_metrics_label_applied_lead.graphql';
import type { labels_metrics_label_removed_lead$key } from './__generated__/labels_metrics_label_removed_lead.graphql';

export const labelCreated = () => {
	return {
		component: 'label',
		eventAction: 'created',
		eventData: {
			object_type: 'lead',
		},
	};
};

export const labelDeleted = () => {
	return {
		component: 'label',
		eventAction: 'deleted',
		eventData: {
			object_type: 'lead',
		},
	};
};

export const labelEdited = () => {
	return {
		component: 'label',
		eventAction: 'edited',
		eventData: {
			object_type: 'lead',
		},
	};
};

export const labelApplied = (leadRef: labels_metrics_label_applied_lead$key) => {
	const lead = readInlineData(
		graphql`
			fragment labels_metrics_label_applied_lead on Lead @inline {
				leadID: id(opaque: false)
			}
		`,
		leadRef,
	);

	return {
		component: 'lead',
		eventAction: 'label_applied',
		eventData: {
			lead_id: lead.leadID,
		},
	};
};

export const labelRemoved = (leadRef: labels_metrics_label_removed_lead$key) => {
	const lead = readInlineData(
		graphql`
			fragment labels_metrics_label_removed_lead on Lead @inline {
				leadID: id(opaque: false)
			}
		`,
		leadRef,
	);

	return {
		component: 'lead',
		eventAction: 'label_removed',
		eventData: {
			lead_id: lead.leadID,
		},
	};
};
