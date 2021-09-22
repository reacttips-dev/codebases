import { snakeCase } from 'lodash';
import { types } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import { FilterByField } from '../../../../types/apollo-query-types';
import { FilterOption } from '../../../../types/report-options';
import { FilterType } from '../../../../utils/constants';

export const isTeamFilter = (filterKey: string): boolean =>
	filterKey === 'teamId';

export const getTeamOptions = (teams: any = []) => {
	return teams
		.filter((team: any) => team.active_flag)
		.map((team: any) => ({
			id: team.id,
			name: team.name,
		}));
};

export const getOperands = (
	filter: FilterByField,
	filterOptions: FilterOption[],
): types.Operand[] => {
	return filter.type.inputFields.map((operand) => {
		if (filterOptions.length === 0) {
			return operand as types.Operand;
		}

		return {
			...operand,
			defaultValue: filterOptions[0],
		} as types.Operand;
	});
};

export const mapTeamFilter = (
	filter: FilterByField,
	teams: any,
	translator: Translator,
) => {
	const filterKey = filter.name;
	const options = getTeamOptions(teams);

	return {
		key: snakeCase(filterKey),
		name: translator.gettext('Team'),
		type: FilterType.TEAM,
		filter: filterKey,
		isCustomField: false,
		options,
		operands: getOperands(filter, options),
	};
};
