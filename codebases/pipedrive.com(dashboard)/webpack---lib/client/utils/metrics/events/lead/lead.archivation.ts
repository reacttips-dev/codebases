import { graphql, readInlineData } from '@pipedrive/relay';
import { EntryPoint } from 'Utils/EntryPoint';
import { getSource } from 'Utils/metrics/events/utils/getSource';
import { hasOrganizationAddress } from 'Utils/metrics/events/utils/hasOrganizationAddress';
import { hasPersonEmail } from 'Utils/metrics/events/utils/hasPersonEmail';
import { hasOrganizationName } from 'Utils/metrics/events/utils/hasOrganizationName';
import { hasPersonName } from 'Utils/metrics/events/utils/hasPersonName';
import { hasPersonPhone } from 'Utils/metrics/events/utils/hasPersonPhone';
import { getAppliedLabels } from 'Utils/metrics/events/utils/getAppliedLabels';
import { constants } from 'Utils/metrics/events/utils/constants';
import { getEntryPoint } from 'Utils/metrics/events/utils/getEntryPoint';

import type {
	leadArchivation_tracking_data$data,
	leadArchivation_tracking_data$key,
} from './__generated__/leadArchivation_tracking_data.graphql';

const leadArchiveFragment = graphql`
	fragment leadArchivation_tracking_data on Lead @inline {
		leadID: id(opaque: false)
		...getSource
		labels {
			__typename
		}
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
	}
`;

const getArchiveTrackingData = (lead: leadArchivation_tracking_data$data, entryPoint: EntryPoint) => {
	return {
		lead_id: lead.leadID,
		lead_source: getSource(lead),
		address_filled: hasOrganizationAddress(lead.organization),
		email_filled: hasPersonEmail(lead.person),
		organization_name_filled: hasOrganizationName(lead.organization),
		person_name_filled: hasPersonName(lead.person),
		phone_filled: hasPersonPhone(lead.person),
		applied_labels: getAppliedLabels(lead),
		label_count: lead.labels?.length,
		entry_point: getEntryPoint(entryPoint),
		page: constants.PAGE,
		view_code: constants.VIEW_CODE,
	};
};

export const leadUnarchived = (leadFragmentRef: leadArchivation_tracking_data$key, entryPoint: EntryPoint) => {
	const lead = readInlineData(leadArchiveFragment, leadFragmentRef);

	if (!entryPoint || !lead) {
		return null;
	}

	return {
		component: 'lead',
		eventAction: 'unarchived',
		eventData: getArchiveTrackingData(lead, entryPoint),
	};
};

export const leadArchived = (leadFragmentRef: leadArchivation_tracking_data$key, entryPoint: EntryPoint) => {
	const lead = readInlineData(leadArchiveFragment, leadFragmentRef);

	if (!entryPoint || !lead) {
		return null;
	}

	return {
		component: 'lead',
		eventAction: 'archived',
		eventData: getArchiveTrackingData(lead, entryPoint),
	};
};
