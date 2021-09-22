import { graphql, readInlineData } from '@pipedrive/relay';

import type { composeDealModalPrefillCustomFields$key } from './__generated__/composeDealModalPrefillCustomFields.graphql';
import type { composeDealModalPrefillCustomFieldsReducer$key } from './__generated__/composeDealModalPrefillCustomFieldsReducer.graphql';

type ExistingEntity = {
	id: number;
	name: string;
};

type NonExistingEntity = string;

type Varchar = string;
type Text = string;
type Numeric = number;
type SingleOption = { id: number };
type MultipleOptions = SingleOption[];
type Autocomplete = string;
type Monetary = { label: string; value: number };
type Organization = ExistingEntity | NonExistingEntity;
type Person = ExistingEntity | NonExistingEntity;
type Time = string; // e.g. 16:30
type TimeRange = { startTime: Time; endTime: Time };
type Date = string; // e.g. 2020-04-21
type DateRange = { startDate: Date; endDate: Date }; // e.g. 2020-04-21

export type DealModalPrefillCustomField =
	| Varchar
	| Text
	| Numeric
	| SingleOption
	| MultipleOptions
	| Autocomplete
	| Monetary
	| Organization
	| Person
	| Time
	| TimeRange
	| Date
	| DateRange;

export type DealModalPrefillCustomFieldsMap = {
	[key: string]: DealModalPrefillCustomField;
};

export function formatGraphQLDate(input: string | null): string {
	if (input === null) {
		return '';
	}
	const [date] = new Date(input).toISOString().split('T');

	return date;
}

export function formatGraphQLTime(input: string | null): string {
	if (input === null) {
		return '';
	}

	return input.split(':', 2).join(':');
}

/**
 * This function takes the GraphQL response and generates JSON payload to get prefill values in add deal modal.
 */
// eslint-disable-next-line complexity
export function composeDealModalPrefillCustomFields(
	customFieldsRef: composeDealModalPrefillCustomFields$key | null,
): DealModalPrefillCustomField | null {
	const cf = readInlineData(
		graphql`
			fragment composeDealModalPrefillCustomFields on CustomField @inline {
				__typename
				... on CustomFieldAddress {
					address
				}
				... on CustomFieldAutocomplete {
					value
				}
				... on CustomFieldDate {
					date
				}
				... on CustomFieldDateRange {
					dateStart: start
					dateEnd: end
				}
				... on CustomFieldLargeText {
					text
				}
				... on CustomFieldMonetary {
					moneyValue: value {
						amount
						currency {
							code
						}
					}
				}
				... on CustomFieldMultipleOptions {
					options {
						internalID: id(opaque: false)
					}
				}
				... on CustomFieldNumeric {
					number
				}
				... on CustomFieldPhone {
					phone
				}
				... on CustomFieldSingleOption {
					option {
						internalID: id(opaque: false)
					}
				}
				... on CustomFieldText {
					text
				}
				... on CustomFieldTime {
					time
				}
				... on CustomFieldTimeRange {
					timeStart: start
					timeEnd: end
				}
				... on CustomFieldPerson {
					person {
						internalID: id(opaque: false)
						name
					}
				}
				... on CustomFieldOrganization {
					organization {
						internalID: id(opaque: false)
						name
					}
				}
			}
		`,
		customFieldsRef,
	);

	if (cf == null) {
		return null;
	}

	switch (cf.__typename) {
		case 'CustomFieldAddress':
			return cf.address;
		case 'CustomFieldAutocomplete':
			return cf.value;
		case 'CustomFieldDate':
			return cf.date && formatGraphQLDate(cf.date);
		case 'CustomFieldDateRange':
			return {
				startDate: formatGraphQLDate(cf.dateStart),
				endDate: formatGraphQLDate(cf.dateEnd),
			};
		case 'CustomFieldLargeText':
			return cf.text;
		case 'CustomFieldMonetary':
			return cf.moneyValue?.amount
				? {
						value: Number(cf.moneyValue.amount),
						label: cf.moneyValue.currency.code ?? '',
				  }
				: null;
		case 'CustomFieldMultipleOptions':
			return Array.isArray(cf.options)
				? cf.options?.map((option) => ({ id: Number(option.internalID) })) ?? []
				: null;
		case 'CustomFieldNumeric':
			return cf.number == null ? null : Number(cf.number);
		case 'CustomFieldPhone':
			return cf.phone;
		case 'CustomFieldSingleOption':
			return cf.option?.internalID
				? {
						id: Number(cf.option.internalID),
				  }
				: null;
		case 'CustomFieldText':
			return cf.text;
		case 'CustomFieldTime':
			return formatGraphQLTime(cf.time);
		case 'CustomFieldTimeRange':
			return cf.timeStart || cf.timeEnd
				? {
						startTime: formatGraphQLTime(cf.timeStart),
						endTime: formatGraphQLTime(cf.timeEnd),
				  }
				: null;
		case 'CustomFieldPerson':
			return cf.person?.internalID
				? {
						id: Number(cf.person.internalID),
						name: cf.person.name ?? '',
				  }
				: null;
		case 'CustomFieldOrganization':
			return cf.organization?.internalID
				? {
						id: Number(cf.organization.internalID),
						name: cf.organization.name ?? '',
				  }
				: null;
		default:
			return null;
	}
}

export const composeDealPrefillCustomFieldsReducer = (
	legacyCustomFields: DealModalPrefillCustomFieldsMap,
	customFieldRef: composeDealModalPrefillCustomFieldsReducer$key | null,
) => {
	const customField = readInlineData(
		graphql`
			fragment composeDealModalPrefillCustomFieldsReducer on CustomField @inline {
				internalID: id(opaque: false)
				...composeDealModalPrefillCustomFields
			}
		`,
		customFieldRef,
	);
	const legacyCustomField = composeDealModalPrefillCustomFields(customField);

	if (legacyCustomField) {
		legacyCustomFields[customField?.internalID ?? ''] = legacyCustomField;
	}

	return legacyCustomFields;
};
