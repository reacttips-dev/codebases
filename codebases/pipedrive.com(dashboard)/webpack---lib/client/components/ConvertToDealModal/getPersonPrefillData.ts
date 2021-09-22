import { readInlineData, graphql } from '@pipedrive/relay';
import { removeEmpty } from 'Utils/utils';

import { composeDealPrefillCustomFieldsReducer } from './composeDealModalPrefillCustomFields';
import type { getPersonPrefillData$key } from './__generated__/getPersonPrefillData.graphql';

type PersonPrefill = {
	email?: { value: string; label: string }[];
	phone?: { value: string; label: string }[];
};

// eslint-disable-next-line complexity
export const getPersonPrefillData = (leadRef: getPersonPrefillData$key | null): PersonPrefill | undefined => {
	const lead = readInlineData(
		graphql`
			fragment getPersonPrefillData on Lead @inline {
				person {
					emails(first: 1) {
						email
						label
					}
					phones(first: 1) {
						phone
						label
					}
					customFields {
						...composeDealModalPrefillCustomFieldsReducer
					}
				}
			}
		`,
		leadRef,
	);

	const person = lead?.person;

	if (!person) {
		return;
	}

	const email = person.emails && person.emails[0];
	const phone = person.phones && person.phones[0];

	const hasEmailValue = Boolean(email?.email);
	const hasPhoneValue = Boolean(phone?.phone);

	const customFields = person?.customFields?.reduce(composeDealPrefillCustomFieldsReducer, {}) ?? {};

	return removeEmpty({
		email:
			hasEmailValue && email
				? [{ value: email.email ?? '', label: email.label?.toLowerCase() ?? 'other' }]
				: undefined,
		phone:
			hasPhoneValue && phone
				? [{ value: phone.phone ?? '', label: phone.label?.toLowerCase() ?? 'other' }]
				: undefined,
		...customFields,
	});
};
