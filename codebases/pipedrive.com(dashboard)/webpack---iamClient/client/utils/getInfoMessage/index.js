import { infoMessages } from 'data/infoMessages';

export default (gettext, isArticleView /* companyFeatures, isAdmin*/) => {
	const messages = infoMessages(gettext);

	if (messages && !isArticleView) {
		// Example
		/*
		if (companyFeatures.feature && isAdmin) {
			return messages.NAME;
		}
		*/
	}

	return null;
};

export const getInfoMessageLink = (id) => {
	const messages = infoMessages(() => { });
	const messageKeys = Object.keys(messages);

	if (!messageKeys) {
		return null;
	}

	const getMessage = messageKeys.filter(m => messages[m].articleId === id || messages[m].legacyId === id);

	return getMessage.length ? messages[getMessage[0]].amplitudeLink : null;
};
