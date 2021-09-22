export { globalMessagesQueryFragment } from './query.gql';

export const parseToOldGlobalMessages = (messages = []) => {
	if (!messages?.length) {
		return {};
	}

	const [{ id, company, user, type_info: typeInfo, html }] = messages;

	return {
		[id]: {
			id,
			company_id: company.id ? parseInt(company.id, 10) : null,
			user_id: user.id ? parseInt(user.id, 10) : null,
			type_info: typeInfo,
			html
		}
	};
};
