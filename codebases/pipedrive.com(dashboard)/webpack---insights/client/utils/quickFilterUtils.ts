import { periods, types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import {
	QuickFilters,
	Dashboard,
	QuickFilter,
} from '../types/apollo-query-types';
import { FilterTypenameType } from './constants';

export enum QuickFilterType {
	USER = 'user',
	PERIOD = 'period',
}

export type ActiveFilter = {
	value: number | string;
	name: string;
	type: QuickFilterUserTypes;
};

export type FiltersMenuValue = Pipedrive.User & {
	value: string;
	is_user_self: boolean;
};

export enum QuickFilterUserTypes {
	USER = 'user',
	TEAM = 'team',
}

export enum QuickFilterDateType {
	DATE = 'date',
}

enum QuickUserFilterDefaults {
	USER = 'userId',
	TEAM = 'teamId',
}

export const formatPeriodFilter = (
	filter: insightsTypes.Filter,
	saving = false,
): insightsTypes.Filter => {
	if (filter.period === 'custom') {
		return filter;
	}

	return {
		...filter,
		operands: periods
			.getTimePeriodDates(filter.period, saving)
			.map((period) => ({
				...period,
				__typename: FilterTypenameType.SELECTED_OPERAND,
			})),
	};
};

export const formatQuickFilters = (quickFilters: QuickFilter) => {
	if (!quickFilters) {
		return { user: null, period: null };
	}

	const { user, period } = quickFilters;

	return {
		user: user ? JSON.parse(user) : null,
		period: period ? formatPeriodFilter(JSON.parse(period)) : null,
	};
};

export const parseQuickFilters = (
	quickFilters?: Dashboard['quick_filters'],
	userId?: number,
) => {
	if (!quickFilters) {
		return { user: null, period: null };
	}

	const cleanQuickFilters = quickFilters.filter(
		(quickFilter) => quickFilter !== null,
	);

	if (!cleanQuickFilters?.length) {
		return { user: null, period: null };
	}

	const userQuickFilters = cleanQuickFilters.find((quickFilter) => {
		return quickFilter.user_id && quickFilter.user_id === userId;
	});

	if (userQuickFilters) {
		return formatQuickFilters(userQuickFilters);
	}

	/**
	 * This is needed for quick filters
	 * created prior to multi-user implementation
	 */
	return formatQuickFilters(
		cleanQuickFilters.find((quickFilter) => {
			return !quickFilter.user_id;
		}),
	);
};

const applyDateQuickFilter = (
	filter: insightsTypes.Filter,
	dateQuickFitler: insightsTypes.Filter,
) => {
	return filter.type === QuickFilterDateType.DATE && dateQuickFitler;
};

export const isUserFilterSetToEveryone = (
	userQuickFilter: insightsTypes.Filter,
) => userQuickFilter?.operands[0].defaultValue === 0;

const getAppliedUserTypeFilter = (userQuickFilter: insightsTypes.Filter) =>
	userQuickFilter?.type === QuickFilterUserTypes.TEAM
		? QuickUserFilterDefaults.TEAM
		: QuickUserFilterDefaults.USER;

export const isUserType = (type: string) =>
	Object.values(QuickFilterUserTypes).includes(type as any);

const shouldAddDefaultUserFilter = (
	userQuickFilter: insightsTypes.Filter,
	filtersWithQuickFilters: insightsTypes.Filter[],
) =>
	userQuickFilter &&
	!isUserFilterSetToEveryone(userQuickFilter) &&
	!filtersWithQuickFilters.find((filter: insightsTypes.Filter) =>
		isUserType(filter.type),
	);

const getUserQuickFilter = (
	filter: insightsTypes.Filter,
	userQuickFilter: insightsTypes.Filter,
) => {
	if (isUserType(filter.type)) {
		return {
			isEveryone: isUserFilterSetToEveryone(userQuickFilter),
			exists: !!userQuickFilter,
		};
	}

	return null;
};

const isDifferentUserType = (
	filter: insightsTypes.Filter,
	userQuickFilter: insightsTypes.Filter,
) => filter.type !== userQuickFilter.type;

export const isQuickFilterSet = (
	quickFilters: QuickFilters,
	type?: QuickFilterType,
) => {
	if (!quickFilters) {
		return false;
	}

	if (type) {
		return !!quickFilters[type];
	}

	const { period: dateQuickFilter, user: userQuickFilter } = quickFilters;

	return !!dateQuickFilter || !!userQuickFilter;
};

export const applyQuickFiltersToReportFilters = (
	filterByFilter: insightsTypes.Filter[],
	quickFilters: QuickFilters,
	keepUsersAsEveryone = false,
) => {
	if (!isQuickFilterSet(quickFilters)) {
		return filterByFilter;
	}

	const { period: dateQuickFilter, user: userQuickFilter } = quickFilters;

	const filtersApplied = [...filterByFilter];

	const getDefaultUserFilter = (type: string, filter: string) => ({
		filter,
		type,
		operands: userQuickFilter.operands,
		isQuickFilter: true,
	});

	const filtersWithQuickFilters = filtersApplied.reduce((acc, filter) => {
		if (applyDateQuickFilter(filter, dateQuickFilter)) {
			acc.push({
				...filter,
				...dateQuickFilter,
				filter: filter.filter,
				isQuickFilter: true,
			});

			return acc;
		}

		if (getUserQuickFilter(filter, userQuickFilter)?.isEveryone) {
			if (keepUsersAsEveryone) {
				const everyone = { ...filter };

				everyone.operands[0].defaultValue = 0;

				acc.push({
					...everyone,
					isQuickFilter: true,
				});
			}

			return acc;
		}

		const userIdAlreadyExistsInFiltersIndex = acc.findIndex((filter) =>
			[
				QuickUserFilterDefaults.USER,
				QuickUserFilterDefaults.TEAM,
			].includes(filter.filter),
		);

		if (isUserType(filter.type) && userIdAlreadyExistsInFiltersIndex > -1) {
			return acc;
		}

		if (getUserQuickFilter(filter, userQuickFilter)?.exists) {
			acc.push({
				...filter,
				...userQuickFilter,
				isQuickFilter: true,
				...(isDifferentUserType(filter, userQuickFilter) && {
					filter: getAppliedUserTypeFilter(userQuickFilter),
				}),
			});

			return acc;
		}

		acc.push(filter);

		return acc;
	}, []);

	if (shouldAddDefaultUserFilter(userQuickFilter, filtersWithQuickFilters)) {
		const defaultUserQuickFilter = getDefaultUserFilter(
			userQuickFilter?.type,
			getAppliedUserTypeFilter(userQuickFilter),
		);

		filtersWithQuickFilters.push(defaultUserQuickFilter);
	}

	return filtersWithQuickFilters;
};

export const getFilterValue = (user: FiltersMenuValue) => {
	if (!user) {
		return null;
	}

	const { value, id, is_user_self } = user;

	if (is_user_self) {
		return value;
	}

	if (value === 'everyone') {
		return 0;
	}

	return id;
};

const defaultUserFilter = (translator: Translator): ActiveFilter => ({
	type: null,
	value: null,
	name: translator.gettext('User'),
});

export const getActiveUserFilter = (
	user: QuickFilters['user'],
	WebappAPI: Pipedrive.API,
	translator: Translator,
) => {
	const type = user?.type;
	const id = user?.operands[0].defaultValue;

	if (type === QuickFilterUserTypes.TEAM) {
		const team = WebappAPI.teams.find((team) => team.id === id);

		if (!team) {
			return defaultUserFilter(translator);
		}

		return { type, value: id, name: (team as any).get('name') };
	}

	if (type === QuickFilterUserTypes.USER) {
		if (id === 0) {
			return {
				type,
				value: 'everyone',
				name: translator.gettext('Everyone'),
			};
		}

		const user = WebappAPI.companyUsers.find((user) => user.id === id);

		if (!user) {
			return defaultUserFilter(translator);
		}

		return { type, value: id, name: (user as any).get('name') };
	}

	return defaultUserFilter(translator);
};
