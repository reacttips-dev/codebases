import { events as seshetaEvents } from 'constants/sesheta.json';
import { events as amplitudeEvents } from 'constants/amplitude.json';
import { serializeSuggestedArticles } from 'utils/serializeArticles';
import { categorizeSuggestions } from 'reducers/contextualSupport/search';

export const SUPPORT_ARTICLE_CLICKED = 'SUPPORT_ARTICLE_CLICKED';
export const SUPPORT_ARTICLE_REQUEST = 'SUPPORT_ARTICLE_REQUEST';
export const SUPPORT_ARTICLE_RECEIVE = 'SUPPORT_ARTICLE_RECEIVE';
export const SUPPORT_ARTICLE_FAIL = 'SUPPORT_ARTICLE_FAIL';

export const SUPPORT_SUGGESTIONS_REQUEST = 'SUGGESTIONS_REQUEST';
export const SUPPORT_SUGGESTIONS_RECEIVE = 'SUGGESTIONS_RECEIVE';
export const SUPPORT_SUGGESTIONS_FAIL = 'SUGGESTIONS_FAIL';

export const SUPPORT_ARTICLE_FEEDBACK_VOTE = 'SUPPORT_ARTICLE_FEEDBACK_VOTE';
export const SUPPORT_ARTICLE_FEEDBACK_SEND = 'SUPPORT_ARTICLE_FEEDBACK_SEND';
export const SUPPORT_ARTICLE_FEEDBACK_SUCCESS = 'SUPPORT_ARTICLE_FEEDBACK_SUCCESS';
export const SUPPORT_ARTICLE_FEEDBACK_FAIL = 'SUPPORT_ARTICLE_FEEDBACK_FAIL';

export const articleReceive = (requestedArticle, receivedArticle) => {
	return {
		type: SUPPORT_ARTICLE_RECEIVE,
		article: receivedArticle,
		meta: {
			sesheta: {
				name: seshetaEvents.article.OPENED,
				data: {
					id: receivedArticle.articleId,
					zendeskId: receivedArticle.legacyId,
					language: receivedArticle.locale,
				},
			},
		},
	};
};

export const articleFail = () => ({
	type: SUPPORT_ARTICLE_FAIL,
});

export const articleClicked = (id, ogTitle, query, isSuggested, eventProps) => {
	const { event, link } = isSuggested
		? { event: amplitudeEvents.sidebar.CLICKED_EXTERNAL_LINK, link: eventProps.link || 'suggested_article' }
		: { event: amplitudeEvents.search.CLICKED, link: null };

	const { source } = eventProps;

	return {
		type: SUPPORT_ARTICLE_CLICKED,
		meta: {
			amplitude: {
				event,
				data: {
					item_id: id,
					article_name: ogTitle,
					keyword: query,
					source,
					link,
				},
			},
		},
	};
};

export const newNavArticleClicked = () => {
	return {
		type: SUPPORT_ARTICLE_CLICKED,
	};
};

export const getArticle = (id, locale) => {
	const requestedArticle = {
		id,
		locale,
	};

	const request = {
		endpoint: `/api/v1/kb-api/support-articles/${id}/${locale}`,
		method: 'GET',
	};

	return {
		type: SUPPORT_ARTICLE_REQUEST,
		meta: {
			fetch: {
				request,
				success: articleReceive.bind(null, requestedArticle),
				fail: articleFail,
			},
		},
	};
};

export const suggestionsReceive = (results, lang) => {
	const categorizedResults = categorizeSuggestions(results, lang);

	return {
		type: SUPPORT_SUGGESTIONS_RECEIVE,
		results: categorizedResults,
		meta: {
			sesheta: {
				name: seshetaEvents.suggestions.RECEIVED,
				data: serializeSuggestedArticles(categorizedResults || {}),
			},
		},
	};
};

export const suggestionsFail = (error) => {
	return {
		type: SUPPORT_SUGGESTIONS_FAIL,
		error,
	};
};

export const suggestRequest = (url, userLang) => {
	const request = {
		endpoint: `/api/v1/kb-api/contextual-support-articles/by-url`,
		method: 'GET',
		params: {
			url,
			locale: userLang,
			limit: 5,
		},
	};

	return {
		type: SUPPORT_SUGGESTIONS_REQUEST,
		url,
		meta: {
			fetch: {
				request,
				success: (results) => suggestionsReceive(results, userLang),
				fail: suggestionsFail,
			},
		},
	};
};

export const suggest = (url) => (dispatch, getState) => {
	const userLang = getState().user.userLang;

	return dispatch(suggestRequest(url, userLang));
};

export const sendArticleFeedbackSuccess = () => ({
	type: SUPPORT_ARTICLE_FEEDBACK_SUCCESS,
});

export const sendArticleFeedbackFail = () => ({
	type: SUPPORT_ARTICLE_FEEDBACK_FAIL,
});

export const sendArticleFeedback = ({
	articleId,
	articleTitle,
	isPositive,
	message,
	url,
	canContactUser,
}) => {
	const params = {
		articleId,
		articleTitle,
		isPositiveVote: isPositive,
		message,
		submissionUrl: url,
		canContactUser,
	};

	const request = {
		endpoint: `/api/v1/kb-api/support/article-feedback`,
		method: 'POST',
		params,
	};

	return {
		type: SUPPORT_ARTICLE_FEEDBACK_SEND,
		id: articleId,
		meta: {
			fetch: {
				request,
				success: sendArticleFeedbackSuccess,
				fail: sendArticleFeedbackFail,
			},
		},
	};
};

export const trackArticleVote = (id, title, isPositive) => {
	const event = amplitudeEvents.sidebar.VOTED_ON_ARTICLE;

	return {
		type: SUPPORT_ARTICLE_FEEDBACK_VOTE,
		meta: {
			amplitude: {
				event,
				data: {
					item_id: id,
					article_name: title,
					vote: isPositive ? 'thumb_up' : 'thumb_down',
					source: 'contextual_support',
				},
			},
		},
	};
};
