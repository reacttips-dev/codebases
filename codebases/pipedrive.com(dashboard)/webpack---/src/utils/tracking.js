import logger from './logger';

export const getAge = (timestamp) => {
	const currentTime = new Date();
	const actionTime = new Date(timestamp);
	const ageInMinutes = (currentTime - actionTime) / 1000 / 60;

	return Math.round(ageInMinutes * 100) / 100;
};

const getRandomId = () => Math.random().toString(36).substring(7);

const getTypeAsDoneInWebapp = (item) => {
	const extension = item.name?.split('.').slice(1).pop();

	return ['img', 'png', 'jpg', 'jpeg', 'gif'].includes(extension) ? 'img' : extension;
};

const trackerState = {
	searchSessionId: '',
	isOpenedEventSent: false,
	searchPhraseSessionId: '',
};

let searchPhraseSessionTimestamp;
const recordSearchPhraseSession = () => {
	searchPhraseSessionTimestamp = new Date();
	if (!trackerState.searchPhraseSessionId) {
		trackerState.searchPhraseSessionId = getRandomId();
	}
};

function initializeTracker(tracker) {
	const sendEvent = (component, action, passedData = {}) => {
		passedData.search_session_id = trackerState.searchSessionId;
		passedData.search_phrase_session_id = trackerState.searchPhraseSessionId;

		try {
			tracker.trackUsage(null, component, action, passedData);
		} catch (err) {
			logger.remote('warning', 'Failed to send tracking event', { error_message: err.message });
		}
	};
	return {
		recentItemsOpened: (recentKeywords, recentItems) => {
			const { min: recentItemsMinAge, max: recentItemsMaxAge } = recentItems.reduce((acc, item) => {
				const actionAge = getAge(item.action_time);
				return {
					min: !acc.min || acc.min > actionAge ? actionAge : acc.min,
					max: !acc.max || acc.max < actionAge ? actionAge : acc.max,
				};
			}, {});

			sendEvent('recent_items', 'opened', {
				recent_items_count: recentItems.length,
				recent_items_min_age: recentItemsMinAge,
				recent_items_max_age: recentItemsMaxAge,
				keyword_count: recentKeywords.length,
				trigger: trackerState.isOpenedEventSent ? 'cleared_input' : 'opened_search',
			});

			trackerState.isOpenedEventSent = true;
		},
		searchTermEntered: ({ category, data, term, duration, isFuzzy }) => {
			recordSearchPhraseSession();
			sendEvent('search_term', 'entered', {
				term_length: term.length,
				term_word_count: term.trim().split(/\s+/).length,
				total_item_count: data.length,
				result_count: data.filter((item) => item.result_score > 0).length,
				related_item_count: data.filter((item) => item.result_score === 0).length,
				selected_category: category,
				request_duration: duration,
				is_fuzzy: isFuzzy,
			});
		},

		searchResultSelected: ({ item, selectedBy, selectedSecondaryItem, openedInSameTab }) => {
			const { id, type } = selectedSecondaryItem || item;

			const secondaryLinkProperties = selectedSecondaryItem
				? {
						main_entity_id: item.id,
						main_entity_type: item.type,
				  }
				: {};

			sendEvent('search_result', 'selected', {
				id,
				type,
				...item.trackingData,
				selected_by: selectedBy,
				is_main_entity: !selectedSecondaryItem,
				opened_in_same_tab: openedInSameTab,
				...secondaryLinkProperties,
			});
		},
		recentItemSelected: ({ item, selectedBy, selectedSecondaryItem, openedInSameTab }) => {
			const { id, type } = selectedSecondaryItem || item;

			const { action_time: actionTime, ...trackingData } = item.trackingData;

			const secondaryLinkProperties = selectedSecondaryItem
				? {
						main_entity_id: item.id,
						main_entity_type: item.type,
				  }
				: {};

			sendEvent('recent_item', 'selected', {
				id,
				type,
				...trackingData,
				age: getAge(actionTime),
				selected_by: selectedBy,
				is_main_entity: !selectedSecondaryItem,
				opened_in_same_tab: openedInSameTab,
				...secondaryLinkProperties,
			});
		},
		recentKeywordSelected: ({ item, selectedBy }) => {
			const {
				term,
				category,
				trackingData: { created, rank, keyword_count: keywordCount },
			} = item;

			recordSearchPhraseSession();
			sendEvent('recent_keyword', 'selected', {
				rank,
				category,
				keyword_length: term.length,
				keyword_count: keywordCount,
				keyword_age: getAge(created),
				selected_by: selectedBy,
			});
		},
		searchCategorySelected: (category) => {
			sendEvent('search_category', 'selected', { category });
		},
		fileOpened: (item) => {
			sendEvent('file', 'opened', {
				id: item.id,
				type: getTypeAsDoneInWebapp(item),
				source: item.isSearchResult ? 'search' : 'recent_items',
			});
		},
		quickHelpOpened: ({ hasResults }) => {
			sendEvent('quick_help', 'opened', { has_results: hasResults });
		},
		searchFeedbackSubmitted: ({ feedbackCategory, comment, canContactMeChecked }) => {
			sendEvent('search_feedback', 'submitted', {
				feedback_category: feedbackCategory,
				comment,
				can_contact_me: canContactMeChecked,
			});
		},
	};
}

const track = {
	init: function (tracker) {
		Object.assign(this, initializeTracker(tracker));
	},
	recordModalOpening: function () {
		trackerState.searchSessionId = getRandomId();
		trackerState.isOpenedEventSent = false;
		if (olderThan5minutes(searchPhraseSessionTimestamp)) {
			endSearchPhraseSession();
		}
	},
	endSearchPhraseSession,
};

export default track;

function endSearchPhraseSession() {
	trackerState.searchPhraseSessionId = '';
}

function olderThan5minutes(date) {
	return !!(date && new Date() - date > 5 * 60 * 1000);
}
