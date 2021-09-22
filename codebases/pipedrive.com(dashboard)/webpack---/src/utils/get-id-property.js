const getIdProperty = (type) => {
	switch (type) {
		case 'person':
			return 'person_id';
		case 'deal':
			return 'deal_id';
		case 'lead':
			return 'lead_id';
		case 'organization':
			return 'organization_id';
		case 'user':
			return 'hovered_user_id';
		default:
			return 'item_id';
	}
};

export default getIdProperty;