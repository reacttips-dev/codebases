export const serializeSearchArticles = (results = []) => {
	return {
		articles: results.reduce((acc, bySource) => {
			return {
				[bySource.source]: bySource.hits,
				...acc,
			};
		}, {}),
	};
};

export const serializeSuggestedArticles = (results = {}) => {
	const languages = Object.keys(results);

	return {
		articles: languages.map(lang => results[lang].map(article => article.id).join(',')).join(','),
		languages: languages.map(lang => results[lang].map(() => lang).join(',')).join(','),
	};
};