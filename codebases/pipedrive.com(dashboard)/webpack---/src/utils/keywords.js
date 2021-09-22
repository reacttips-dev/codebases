import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import { KEYWORDS, ITEM_TYPES } from './constants';
import logger from './logger';

const { LOCAL_STORAGE_KEY, MAX_COUNT } = KEYWORDS;

let localStorageKey = null;

export function initLocalStorageKey(user = {}) {
	const companyId = user.attributes && user.attributes.company_id;
	localStorageKey = `${LOCAL_STORAGE_KEY}_${companyId}:${user.id}`;
}

export function fetchRecentKeywords() {
	const value = localStorage.getItem(localStorageKey);

	return value ? JSON.parse(value).map(addAdditionalData) : [];
}

export function storeRecentKeywords(keywords) {
	try {
		localStorage.setItem(localStorageKey, JSON.stringify(keywords));
	} catch (err) {
		// local storage is full, disabled, or misbehaving in other ways
		logger.remote('warning', 'Failed to store recent keywords in local storage', { error_message: err.message });
	}
}

function generateKeywordItem(category, term) {
	return {
		item: {
			category,
			term,
			type: ITEM_TYPES.KEYWORD,
		},
		created: Date.now(),
	};
}

export function addNewKeywordToArray({ category, term }, previousKeywords) {
	const newKeyword = generateKeywordItem(category, term);
	const newKeywords = [newKeyword];

	for (const previousKeyword of previousKeywords) {
		if (newKeywords.length < MAX_COUNT && !areKeywordsEqual(newKeyword, previousKeyword)) {
			newKeywords.push(previousKeyword);
		}
	}

	return newKeywords;
}

function areKeywordsEqual(keyword1, keyword2) {
	return isEqual(omit(keyword1, ['item.trackingData', 'created']), omit(keyword2, ['item.trackingData', 'created']));
}

function addAdditionalData(keyword, index, keywords) {
	keyword.item.trackingData = {
		rank: index + 1,
		keyword_count: keywords.length,
		created: keyword.created,
	};

	return keyword;
}
