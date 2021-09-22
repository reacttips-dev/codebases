import { ALL_CATEGORIES, ITEM_TYPES } from './constants';
import { isFile } from './listItem';
import translator from './translator';
import logger from './logger';

const { DEAL, LEAD, PERSON, ORGANIZATION, PRODUCT, FILE } = ITEM_TYPES;

export const getSidePanelCategories = () => [
	{ name: translator.gettext('All categories'), type: ALL_CATEGORIES },
	{ name: translator.gettext('Deals'), type: DEAL },
	{ name: translator.gettext('Leads'), type: LEAD },
	{ name: translator.gettext('People'), type: PERSON },
	{ name: translator.gettext('Organizations'), type: ORGANIZATION },
	{ name: translator.gettext('Products'), type: PRODUCT },
	{ name: translator.gettext('Files'), type: FILE },
];

export const getSearchResultsTitles = () => ({
	[ALL_CATEGORIES]: translator.gettext('All search results'),
	[DEAL]: translator.gettext('Search results for deals'),
	[LEAD]: translator.gettext('Search results for leads'),
	[PERSON]: translator.gettext('Search results for people'),
	[ORGANIZATION]: translator.gettext('Search results for organizations'),
	[PRODUCT]: translator.gettext('Search results for products'),
	[FILE]: translator.gettext('Search results for files'),
});

export const getFuzzySearchResultsTitle = (term) => {
	return translator.pgettext(
		'Similar results for [word that was entered to search box]',
		'Similar results for ’%s’',
		term,
	);
};

export function filterOutExistingResults(newResults, existingResults) {
	return newResults.filter(({ item }) => !itemInResultsList(item, existingResults));
}

function itemInResultsList({ id, type }, list) {
	return list.find(({ item }) => item.type === type && item.id === id);
}

export function filterResultsByCategory(results, category) {
	if (category === ALL_CATEGORIES || !results) {
		return results;
	}

	return results.filter(({ item }) => {
		const itemCategory = isFile(item) ? FILE : item.type;

		return itemCategory === category;
	});
}

export function clearSelection() {
	window.getSelection().removeAllRanges?.();
}

export async function fetchQuickInfoCard(componentLoader) {
	try {
		const component = await componentLoader.load('quick-info-card');

		return component.default;
	} catch (err) {
		logger.remote('warning', 'failed to load quick-info-card in search-fe', {
			error_message: err.message,
		});
		return null;
	}
}

export function isModifierKeyClick(e = {}) {
	return e.ctrlKey || e.metaKey;
}

export function isMiddleMouseClick(e = {}) {
	return e.button === 1;
}
