import { graphql, readInlineData } from '@pipedrive/relay';
import { getVisibilityRoleId } from 'Utils/getVisibility';
import { removeEmpty } from 'Utils/utils';

import {
	composeDealPrefillCustomFieldsReducer,
	DealModalPrefillCustomFieldsMap,
} from './composeDealModalPrefillCustomFields';
import type { getDealPrefillData$key, VisibleTo } from './__generated__/getDealPrefillData.graphql';
import type { getDealPrefillDataValue$key } from './__generated__/getDealPrefillDataValue.graphql';

type ExistingEntity = {
	id: number;
	name: string;
};

type NonExistingEntity = string;

/**  type according to deal fields here https://github.com/pipedrive/add-modals/blob/master/client/components/AddModal/AddDealModal/AddDealModal.config.ts#L11 + https://github.com/pipedrive/add-modals#deal-modal */
export type DealPrefill = {
	org_id?: ExistingEntity | NonExistingEntity;
	person_id?: ExistingEntity | NonExistingEntity;
	value?: { value: number; label: string };
	/** Owner id */
	user_id?: number;
	title?: string;
	visibleTo?: VisibleTo | null;
};

export type LeadAlreadyConverted = {
	dealId: number;
};

export const isLeadAlreadyConverted = (param: DealPrefill | LeadAlreadyConverted): param is LeadAlreadyConverted => {
	return Boolean((param as LeadAlreadyConverted).dealId);
};

const getDealValue = (dealValueInfoRef: getDealPrefillDataValue$key | null): DealPrefill['value'] => {
	const deal = readInlineData(
		graphql`
			fragment getDealPrefillDataValue on DealInfo @inline {
				value {
					amount
					currency {
						code
					}
				}
			}
		`,
		dealValueInfoRef,
	);

	if (deal?.value?.amount) {
		return {
			value: Number(deal?.value?.amount),
			label: deal.value.currency.code,
		};
	}
};

/**
 * If the user is not allowed to change the Lead's visibility ownership for which the resulting
 * deal will be placed, we select the default group ourselves. The value that the user has set
 * as default for deals visibility will be used in that case.
 */
export const getVisibleTo = (visibleTo: VisibleTo | null, userSelf: Webapp.UserSelf) => {
	const canChangeVisibilityOfItems = userSelf.settings.get('can_change_visibility_of_items');
	if (canChangeVisibilityOfItems === false) {
		return userSelf.settings.get('deal_default_visibility');
	}

	return getVisibilityRoleId(visibleTo);
};

/* eslint-disable complexity */
export const getDealPrefillData = (
	leadRef: getDealPrefillData$key,
	userSelf: Webapp.UserSelf,
): DealPrefill | LeadAlreadyConverted => {
	const lead = readInlineData(
		graphql`
			fragment getDealPrefillData on Lead @inline {
				internalID: id(opaque: false)
				title
				owner {
					internalID: id(opaque: false)
				}
				person {
					internalID: id(opaque: false)
					isLinkedToLead
					name
				}
				organization {
					internalID: id(opaque: false)
					isLinkedToLead
					name
				}
				deal {
					__typename
					... on DealInfo {
						...getDealPrefillDataValue
						customFields {
							...composeDealModalPrefillCustomFieldsReducer
						}
					}
					... on PipedriveDeal {
						internalID: id(opaque: false)
					}
				}
				visibleTo
			}
		`,
		leadRef,
	);

	if (lead.deal?.__typename === 'PipedriveDeal') {
		return {
			dealId: Number(lead.deal.internalID),
		};
	}

	if (lead.deal?.__typename !== 'DealInfo') {
		throw new Error('Unexpected Deal type resolved. Expected one of: PipedriveDeal or DealInfo.');
	}

	const organization = lead.organization;
	const organizationName = organization?.name ? organization.name : '';

	const person = lead?.person;
	const personName = person?.name ? person.name : '';

	const customFields =
		lead.deal?.customFields?.reduce<DealModalPrefillCustomFieldsMap>(composeDealPrefillCustomFieldsReducer, {}) ??
		{};

	const value = getDealValue(lead.deal);

	return removeEmpty({
		org_id: organization?.isLinkedToLead
			? { id: Number(organization.internalID), name: organizationName }
			: organizationName,
		person_id: person?.isLinkedToLead ? { id: Number(person.internalID), name: personName } : personName,
		user_id: lead.owner ? Number(lead.owner.internalID) : undefined,
		title: lead.title ?? undefined,
		value,
		visible_to: getVisibleTo(lead.visibleTo, userSelf) ?? undefined,
		...customFields,
	});
};
