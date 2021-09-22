import { readInlineData, graphql } from '@pipedrive/relay';
import { EntryPoint } from 'Utils/EntryPoint';
import { constants } from 'Utils/metrics/events/utils/constants';
import { getAge } from 'Utils/metrics/events/utils/getAge';
import { getEntryPoint } from 'Utils/metrics/events/utils/getEntryPoint';
import { getSource } from 'Utils/metrics/events/utils/getSource';
import { hasOrganizationAddress } from 'Utils/metrics/events/utils/hasOrganizationAddress';
import { hasOrganizationName } from 'Utils/metrics/events/utils/hasOrganizationName';
import { hasPersonEmail } from 'Utils/metrics/events/utils/hasPersonEmail';
import { hasPersonName } from 'Utils/metrics/events/utils/hasPersonName';
import { hasPersonPhone } from 'Utils/metrics/events/utils/hasPersonPhone';

import type { getDealAddedTrackingData_lead$key } from './__generated__/getDealAddedTrackingData_lead.graphql';

export const getDealAddedTrackingData = (
	leadRef: getDealAddedTrackingData_lead$key,
	convertModalEntryPoint: EntryPoint | null,
) => {
	if (convertModalEntryPoint == null) {
		return null;
	}

	const lead = readInlineData(
		graphql`
			fragment getDealAddedTrackingData_lead on Lead @inline {
				internalID: id(opaque: false)
				...getAge
				...getSource
				person {
					...hasPersonName
					...hasPersonPhone
					...hasPersonEmail
				}
				organization {
					...hasOrganizationName
					...hasOrganizationAddress
				}
			}
		`,
		leadRef,
	);

	if (lead == null) {
		return null;
	}

	return {
		page: constants.PAGE,
		view_code: constants.VIEW_CODE,
		lead_id: lead.internalID,
		lead_age_days: getAge(lead),
		entry_point: getEntryPoint(convertModalEntryPoint),
		lead_source: getSource(lead),
		person_name_filled: hasPersonName(lead.person),
		organization_name_filled: hasOrganizationName(lead.organization),
		phone_filled: hasPersonPhone(lead.person),
		email_filled: hasPersonEmail(lead.person),
		address_filled: hasOrganizationAddress(lead.organization),
	};
};
