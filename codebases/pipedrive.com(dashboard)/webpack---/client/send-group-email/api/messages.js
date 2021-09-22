import _ from 'lodash';
import { get } from '@pipedrive/fetch';
import { getPreparedDealData, getPreparedPersonData } from 'templates/helpers/field-picker';
import { MAX_MESSAGES_PER_GROUP_EMAIL } from '../constants';
import pLimit from 'p-limit';

const appendPictureToPerson = (person, pictures) => {
	if (!pictures) {
		return person;
	}

	if (person.picture_id in pictures) {
		person.picture = pictures[person.picture_id].pictures['128'];
	}
};

const appendPicturesToPersons = (persons, pictures) => {
	persons.forEach((person) => appendPictureToPerson(person, pictures));
};

const getItemsFilteredByExcludedIds = (excludedIds, items) => {
	if (excludedIds && excludedIds.length) {
		items = items.filter((item) => !excludedIds.includes(item.id));
	}

	return items;
};

const collectNewItemsToResultObject = (moreItems, result) => {
	// collect moreItems data to result object
	_.merge(result.related_objects, moreItems.related_objects);
	// _.merge didn't merge arrays correctly, so we do that separately
	result.data = result.data.concat(moreItems.data);

	// group email can be send up to 100 contacts
	// so we just take first 100 contacts
	if (result.data.length > MAX_MESSAGES_PER_GROUP_EMAIL) {
		result.data = result.data.slice(0, MAX_MESSAGES_PER_GROUP_EMAIL);
	}

	return result;
};

const getMoreItemsAndAddToResult = async (result, path, excludedIds) => {
	const resultPaginationData = result.additional_data.pagination;

	let hasMoreItemsInCollection = resultPaginationData.more_items_in_collection;

	// totally we can send group email up to 100 contacts
	// we check here how many contacts we already downloaded with first request
	// and calculate, how many contacts we can download more
	while (hasMoreItemsInCollection && result.data.length < MAX_MESSAGES_PER_GROUP_EMAIL) {
		let nextStart = resultPaginationData.next_start;

		const moreItems = await get(`${path}&start=${nextStart}`);
		const moreItemsPaginationData = moreItems.additional_data.pagination;

		moreItems.data = getItemsFilteredByExcludedIds(excludedIds, moreItems.data);
		result = collectNewItemsToResultObject(moreItems, result);

		hasMoreItemsInCollection = moreItemsPaginationData.more_items_in_collection;
		nextStart = moreItemsPaginationData.next_start;
	}

	return result;
};

const getSelectionResponse = async (
	endpoint,
	{ bulkEditFilter, selectedIds, excludedIds },
	sort
) => {
	const params = { limit: MAX_MESSAGES_PER_GROUP_EMAIL };

	if (sort) {
		params.sort = sort;
	}

	if (bulkEditFilter) {
		Object.assign(params, bulkEditFilter);
	} else {
		params.ids = selectedIds.join(',');
	}

	const query = Object.keys(params)
		.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
		.join('&');
	const path = `${endpoint}?${query}`;

	let result = await get(path);

	result.data = getItemsFilteredByExcludedIds(excludedIds, result.data);

	if (result.data.length < MAX_MESSAGES_PER_GROUP_EMAIL) {
		result = await getMoreItemsAndAddToResult(result, path, excludedIds);
	}

	return result;
};

const mapMessage = (person, deal = null, organization = null, activity = null) => {
	return {
		name: person.name,
		email: person.email,
		person,
		organization,
		deal,
		activity
	};
};
const tryToLinkOneOpenDealToPerson = async (person) => {
	if (person.open_deals_count !== 1) {
		return { ...person, deal: null };
	}

	const { data: deals } = await get(`/api/v1/persons/${person.id}/deals?status=open`);

	return { ...person, deal: deals && deals.length === 1 ? deals[0] : null };
};

const tryToLinkOneOpenDealToPersons = async (persons) => {
	const limit = pLimit(10);

	const listOfLinkPersonPromises = persons.map((person) =>
		limit(() => tryToLinkOneOpenDealToPerson(person))
	);

	return Promise.all(listOfLinkPersonPromises);
};

export const fetchPersons = async (selection, sort, { userSelf }) => {
	const response = await getSelectionResponse('/api/v1/persons/list', selection, sort);
	const persons = response.data.map((person) =>
		getPreparedPersonData(person, response.related_objects, userSelf, {
			skipCustomFields: true
		})
	);

	const personWithLinkedDeals = userSelf.settings.get('connect_threads_with_deals')
		? await tryToLinkOneOpenDealToPersons(persons)
		: persons;

	appendPicturesToPersons(personWithLinkedDeals, response.related_objects.picture || {});

	return [
		personWithLinkedDeals.map((person) => mapMessage(person, person.deal, person.organization)),
		response.related_objects
	];
};

export const fetchPerson = async (personId, userSelf) => {
	const response = await get(`/api/v1/persons/${personId}`);
	const person = getPreparedPersonData(response.data, response.related_objects, userSelf);
	const pictures = response.related_objects.picture;

	appendPictureToPerson(person, pictures);

	return [mapMessage(person, null, person.organization), response.related_objects];
};

export const fetchDealPersons = async (selection, sort, { userSelf }) => {
	const response = await getSelectionResponse('/api/v1/deals/list', selection, sort);
	const deals = response.data
		.filter((deal) => !!deal.person)
		.map((deal) =>
			getPreparedDealData(deal, response.related_objects, userSelf, {
				skipCustomFields: true
			})
		);
	const persons = deals.map((deal) =>
		getPreparedPersonData(deal.person, response.related_objects, userSelf, {
			skipCustomFields: true
		})
	);

	appendPicturesToPersons(persons, response.related_objects.picture || {});

	return [
		deals.map((deal) =>
			mapMessage(deal.person, deal, deal.organization || deal.person.organization)
		),
		response.related_objects
	];
};

export const fetchActivityPersons = async (selection, sort, { userSelf }) => {
	const response = await getSelectionResponse('/api/v1/activities/list', selection, sort);
	const activities = response.data.filter((activity) => !!activity.person);
	const persons = activities.map((activity) =>
		getPreparedPersonData(activity.person, response.related_objects, userSelf, {
			skipCustomFields: true
		})
	);

	appendPicturesToPersons(persons, response.related_objects.picture || {});

	return [
		activities.map((activity) =>
			mapMessage(activity.person, activity.deal, activity.organization, activity)
		),
		response.related_objects
	];
};
