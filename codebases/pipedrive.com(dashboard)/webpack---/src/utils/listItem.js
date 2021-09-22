import { getCookieValue } from '@pipedrive/fetch';

import { resetTermAndResults } from 'store/modules/itemSearch';
import { resetActiveItemIndex, setModalVisible, openImageOverlay } from 'store/modules/sharedState';
import { onKeywordItemClick, recordRecentKeyword } from 'store/modules/recentItems';
import { IMAGE_FILE_EXTENSIONS, ITEM_TYPES, INPUT_TYPES } from './constants';
import track from './tracking';

const { DEAL, LEAD, PERSON, ORGANIZATION, PRODUCT, FILE, MAIL_ATTACHMENT, KEYWORD } = ITEM_TYPES;

export function getItemTitle(item) {
	switch (item.type) {
		case DEAL:
		case LEAD:
			return item.title;
		case PERSON:
		case ORGANIZATION:
		case PRODUCT:
		case FILE:
		case MAIL_ATTACHMENT:
			return item.name;
		case KEYWORD:
			return `‘${item.term}’`;
	}
}

export function getItemHref({ id, type }) {
	switch (type) {
		case DEAL:
			return `/deal/${id}`;
		case LEAD:
			return `/leads/inbox/${id}`;
		case PERSON:
			return `/person/${id}`;
		case ORGANIZATION:
			return `/organization/${id}`;
		case PRODUCT:
			return `/product/${id}`;
		case MAIL_ATTACHMENT:
		case FILE:
			return `/api/v1/files/${id}/download?session_token=${getCookieValue('pipe-session-token')}`;
		default:
			return null;
	}
}

export function isFile(item) {
	return item.type === FILE || item.type === MAIL_ATTACHMENT;
}

export function getFileExtension(item) {
	return item.name?.split('.').slice(1).pop();
}

export function isImageFile(item) {
	return isFile(item) && IMAGE_FILE_EXTENSIONS.includes(getFileExtension(item));
}

export function listItemOnClick({ item, dispatch, router, selectedBy }) {
	onPrimaryLinkClick({ item, dispatch, selectedBy, openedInSameTab: true });

	if (isFile(item)) {
		if (!isImageFile(item)) {
			window.open(getItemHref(item));
		}
		return;
	}

	router.navigateTo(getItemHref(item));
}

export function onPrimaryLinkClick({ item, dispatch, selectedBy, openedInSameTab }) {
	trackPrimaryLinkClick(item, selectedBy, openedInSameTab);

	if (item.type === KEYWORD) {
		dispatch(onKeywordItemClick(item));
		return;
	}

	if (isFile(item)) {
		if (isImageFile(item)) {
			dispatch(openImageOverlay(item));
		}
		return;
	}

	resetStateAfterItemClick({ dispatch, openedInSameTab, isSearchResult: item.isSearchResult });
}

export function onSecondaryLinkClick({ item, dispatch, selectedSecondaryItem, openedInSameTab }) {
	trackSecondaryLinkClick(item, selectedSecondaryItem, openedInSameTab);

	resetStateAfterItemClick({ dispatch, openedInSameTab, isSearchResult: item.isSearchResult });
}

export function resetStateAfterItemClick({ dispatch, openedInSameTab, isSearchResult }) {
	if (isSearchResult) {
		dispatch(recordRecentKeyword());
	}

	if (openedInSameTab) {
		dispatch(setModalVisible(false));

		if (isSearchResult) {
			dispatch(resetTermAndResults());
		} else {
			dispatch(resetActiveItemIndex());
		}
	}
}

export function trackPrimaryLinkClick(item, selectedBy, openedInSameTab) {
	if (item.type === KEYWORD) {
		track.recentKeywordSelected({ item, selectedBy });

		return;
	}

	if (item.isSearchResult) {
		track.searchResultSelected({ item, selectedBy, openedInSameTab });
	} else {
		track.recentItemSelected({ item, selectedBy, openedInSameTab });
	}

	if (isFile(item)) {
		track.fileOpened(item);
	}
}

export function trackSecondaryLinkClick(item, selectedSecondaryItem, openedInSameTab) {
	if (item.isSearchResult) {
		track.searchResultSelected({
			item,
			selectedSecondaryItem,
			selectedBy: INPUT_TYPES.MOUSE,
			openedInSameTab,
		});
	} else {
		track.recentItemSelected({
			item,
			selectedSecondaryItem,
			selectedBy: INPUT_TYPES.MOUSE,
			openedInSameTab,
		});
	}
}
