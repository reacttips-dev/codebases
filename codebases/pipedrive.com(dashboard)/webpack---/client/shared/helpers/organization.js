export const getOrganizationIdFromLinkedEntity = (
	draftModel,
	linkedDeal,
	linkedLead,
	linkedPerson
) => {
	const dealId = draftModel.threadModel?.get('deal_id');
	const leadId = draftModel.threadModel?.get('lead_id');

	if (dealId) {
		return linkedDeal?.data?.org_id;
	}

	if (leadId) {
		return Number(linkedLead?.data?.organization?.id);
	}

	if (linkedPerson) {
		return linkedPerson?.data?.org_id;
	}

	return null;
};
