import { graphql, readInlineData } from '@pipedrive/relay';
import { EntryPoint } from 'Utils/EntryPoint';
import { getSource } from 'Utils/metrics/events/utils/getSource';
import { hasOrganizationName } from 'Utils/metrics/events/utils/hasOrganizationName';
import { hasPersonName } from 'Utils/metrics/events/utils/hasPersonName';
import { hasPersonPhone } from 'Utils/metrics/events/utils/hasPersonPhone';
import { hasPersonEmail } from 'Utils/metrics/events/utils/hasPersonEmail';
import { hasOrganizationAddress } from 'Utils/metrics/events/utils/hasOrganizationAddress';
import { getAppliedLabels } from 'Utils/metrics/events/utils/getAppliedLabels';

import type { leadDeletion_tracking$key } from './__generated__/leadDeletion_tracking.graphql';

export const leadDeleted = (leadFragmentRef: leadDeletion_tracking$key, entryPoint: EntryPoint) => {
	const leadDeleteFragment = graphql`
		fragment leadDeletion_tracking on Lead @inline {
			leadID: id(opaque: false)
			...getSource
			person {
				...hasPersonName
				...hasPersonPhone
				...hasPersonEmail
			}
			organization {
				...hasOrganizationAddress
				...hasOrganizationName
			}
			...getAppliedLabels
			labels {
				__typename
			}
		}
	`;

	const lead = readInlineData(leadDeleteFragment, leadFragmentRef);

	if (!entryPoint || !lead) {
		return null;
	}

	const deleteTrackingData = {
		lead_id: lead.leadID,
		entry_point: entryPoint,
		lead_source: getSource(lead),
		organization_name_filled: hasOrganizationName(lead.organization),
		person_name_filled: hasPersonName(lead.person),
		phone_filled: hasPersonPhone(lead.person),
		email_filled: hasPersonEmail(lead.person),
		address_filled: hasOrganizationAddress(lead.organization),
		label_count: lead.labels?.length,
		applied_labels: getAppliedLabels(lead),
	};

	return {
		component: 'lead',
		eventAction: 'deleted',
		eventData: deleteTrackingData,
	};
};
