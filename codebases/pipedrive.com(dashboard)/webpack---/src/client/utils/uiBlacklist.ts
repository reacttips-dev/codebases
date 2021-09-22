import { updateBlacklistCurrentRule, updateBlacklistedUI, updateItems } from '../store/navigation/actions';
import { BlacklistFilter as Filter } from '../store/navigation/types';

const BLACKLIST_FILTER_ALL = 'all';

export const globalFilters = [BLACKLIST_FILTER_ALL];

/**
 * @summary Updates the current blacklist rule if there's one
 * matching the current path.
 */
export function updateCurrentRule({ currentPath, blacklist, dispatch }) {
	const currentRule = blacklist.rules?.[currentPath];

	if (!currentRule) {
		return;
	}

	dispatch(updateBlacklistCurrentRule(currentRule));
}

/**
 * @summary Updates the registry of the blacklisted UI.
 */
export function updateUI({ currentPath, blacklist, dispatch }) {
	const currentUI = blacklist.rules?.[currentPath]?.ui ?? [];

	const blacklistedUI = currentUI.reduce((acc, uiChunk) => ({ ...acc, [uiChunk]: true }), {});

	dispatch(updateBlacklistedUI(blacklistedUI));
}

/**
 * @summary Gets a boolean if the provided blacklist filter is valid.
 */
export function getIsFilterValid(filter) {
	if (!filter.length) {
		return false;
	}

	if (typeof filter === 'string' && !globalFilters.includes(filter)) {
		return false;
	}

	return true;
}

/**
 * @summary Gets the filtered nav items.
 */
export function getFilteredItems({ items, blacklistedMenus }) {
	return Object.entries(blacklistedMenus).reduce((acc, [key, filter]: [string, Filter]) => {
		if (!items[key] || !getIsFilterValid(filter)) {
			return acc;
		}

		if (filter === 'all') {
			return { ...acc, [key]: [] };
		}

		const filtered = items[key].filter((item) => {
			return !filter.includes(item.key);
		});

		return { ...acc, [key]: filtered };
	}, {});
}

/**
 * @summary Updates the nav items with the filtered ones if
 * there're provided menus in the current blacklist rule.
 */
export function updateNavItems({ items, blacklist, dispatch }) {
	const blacklistedMenus = blacklist.currentRule?.menus;

	if (!blacklistedMenus) {
		return;
	}

	const filteredItems = getFilteredItems({ items, blacklistedMenus });

	dispatch(updateItems(filteredItems));
}
