import memoize from 'memoizee';
import { Translator } from '@pipedrive/react-utils';

import {
	MappedFilterByField,
	FilterOption,
} from '../../../../types/report-options';
import { FilterByField } from '../../../../types/apollo-query-types';
import { FilterType, ActivityFieldKey } from '../../../../utils/constants';
import { getActivityField } from '../../../../utils/filterUtils';
import {
	getActivityFieldTranslatedName,
	getActivityFieldType,
} from '../reportOptionsUtils';
import {
	isTeamFilter,
	mapTeamFilter,
	getOperands,
} from './filtersWithLabelsUtils';
import {
	areTeamsEnabled,
	getFields,
	getPipelines,
	getTeams,
	getUsers,
} from '../../../../api/webapp';

export interface ActivityFilterField {
	key: string;
	name: string;
	field_type: string;
}

const isFilterBlacklisted = (
	filterKey: ActivityFieldKey,
	filterType: FilterType,
): boolean => {
	/* 
		duration field has field_type "time" in webapp api, which
		is blacklisted type, but here we treat duration as "int" type field
	*/
	if (filterKey === ActivityFieldKey.DURATION) {
		return false;
	}

	const blackListedFilterTypes = [FilterType.TIME];

	return blackListedFilterTypes.includes(filterType);
};

export const getFilterOptions = (
	filterKey: ActivityFieldKey,
	fieldFromWebappApi: Pipedrive.ActivityField,
): FilterOption[] => {
	const companyUsers = getUsers();

	switch (filterKey) {
		case ActivityFieldKey.CREATOR:
		case ActivityFieldKey.USER:
			return companyUsers?.filter(
				(user: Pipedrive.User) => user.active_flag,
			);
		case ActivityFieldKey.PIPELINE:
			return getPipelines();
		case ActivityFieldKey.BUSY_FLAG:
		case ActivityFieldKey.TYPE:
		case ActivityFieldKey.DONE:
			return fieldFromWebappApi.options;
		default:
			return [];
	}
};

const mapActivityFieldFilter = ({
	filter,
	activitiyFieldFromWebappApi,
	translator,
}: {
	filter: FilterByField;
	activitiyFieldFromWebappApi: Pipedrive.ActivityField;
	translator: Translator;
}): MappedFilterByField => {
	const filterKey = filter.name as ActivityFieldKey;
	const options = getFilterOptions(filterKey, activitiyFieldFromWebappApi);
	const { key } = activitiyFieldFromWebappApi;
	const fieldType = getActivityFieldType(activitiyFieldFromWebappApi);

	return {
		key,
		name: getActivityFieldTranslatedName(
			activitiyFieldFromWebappApi,
			translator,
		),
		type: fieldType,
		filter: filterKey,
		isCustomField: false,
		options,
		operands: getOperands(filter, options),
	};
};

const getActivitiesFiltersWithLabels = ({
	filters,
	translator,
}: {
	filters: FilterByField[];
	translator: Translator;
}): MappedFilterByField[] => {
	const teams = getTeams();
	const webappApiActivityFields = [
		...getFields('activity'),
	] as Pipedrive.ActivityField[];
	const pipelineField = [
		{
			key: 'pipeline_id',
			name: translator.gettext('Pipeline'),
			field_type: 'pipeline',
		},
	];
	const supplementedFields = webappApiActivityFields.concat(
		pipelineField as Pipedrive.ActivityField[],
	);

	return filters.reduce((result, filter) => {
		const filterKey = filter.name as ActivityFieldKey;

		if (isTeamFilter(filterKey) && areTeamsEnabled()) {
			const mappedTeamsField = mapTeamFilter(filter, teams, translator);

			result.push(mappedTeamsField);

			return result;
		}

		const filterFieldFromWebappApi = getActivityField(
			filterKey,
			supplementedFields,
		);

		if (
			!filterFieldFromWebappApi ||
			isFilterBlacklisted(
				filterKey,
				filterFieldFromWebappApi.field_type as FilterType,
			)
		) {
			return result;
		}

		const mappedField = mapActivityFieldFilter({
			activitiyFieldFromWebappApi: filterFieldFromWebappApi,
			filter,
			translator,
		});

		result.push(mappedField);

		return result;
	}, []);
};

export default memoize(getActivitiesFiltersWithLabels, {
	normalizer: (args) => {
		return JSON.stringify(args[0]?.filters);
	},
});
