import { snakeCase } from 'lodash';
import memoize from 'memoizee';
import { Translator } from '@pipedrive/react-utils';

import { FilterByField } from '../../../../types/apollo-query-types';
import {
	FilterType,
	MailType,
	MailOpenedTrackingStatus,
	MailLinkClickedTrackingStatus,
} from '../../../../utils/constants';
import {
	isTeamFilter,
	mapTeamFilter,
	getOperands,
} from './filtersWithLabelsUtils';
import { areTeamsEnabled, getTeams, getUsers } from '../../../../api/webapp';
import {
	FilterOption,
	MappedFilterByField,
} from '../../../../types/report-options';
import { getMailFieldType, getMailFieldLabel } from '../reportOptionsUtils';
import {
	getMailTypeLabel,
	getMailOpenedTrackingStatusLabel,
	getMailLinkTrackingStatusLabel,
} from '../../../filterUtils';

const WHITELISTED_MAILS_FILTERS = [
	'messageTime',
	'userId',
	'type',
	'teamId',
	'openedTrackingStatus',
	'openTime',
	'linkTrackingStatus',
	'linkClickedTime',
];

const getTypeOptions = (translator: Translator) => {
	return [
		{
			id: MailType.SENT,
			label: getMailTypeLabel(MailType.SENT, translator),
		},
		{
			id: MailType.RECEIVED,
			label: getMailTypeLabel(MailType.RECEIVED, translator),
		},
	];
};

const getOpenedTrackingStatusOptions = (translator: Translator) => {
	return [
		{
			id: MailOpenedTrackingStatus.OPENED,
			label: getMailOpenedTrackingStatusLabel(
				MailOpenedTrackingStatus.OPENED,
				translator,
			),
		},
		{
			id: MailOpenedTrackingStatus.NOT_OPENED,
			label: getMailOpenedTrackingStatusLabel(
				MailOpenedTrackingStatus.NOT_OPENED,
				translator,
			),
		},
		{
			id: MailOpenedTrackingStatus.NOT_TRACKED,
			label: getMailOpenedTrackingStatusLabel(
				MailOpenedTrackingStatus.NOT_TRACKED,
				translator,
			),
		},
	];
};

const getLinkTrackingStatusOptions = (translator: Translator) => {
	return [
		{
			id: MailLinkClickedTrackingStatus.CLICKED,
			label: getMailLinkTrackingStatusLabel(
				MailLinkClickedTrackingStatus.CLICKED,
				translator,
			),
		},
		{
			id: MailLinkClickedTrackingStatus.NOT_CLICKED,
			label: getMailLinkTrackingStatusLabel(
				MailLinkClickedTrackingStatus.NOT_CLICKED,
				translator,
			),
		},
		{
			id: MailLinkClickedTrackingStatus.NOT_TRACKED,
			label: getMailLinkTrackingStatusLabel(
				MailLinkClickedTrackingStatus.NOT_TRACKED,
				translator,
			),
		},
	];
};

const getFilterOption = ({
	filter,
	filterType,
	label,
	translator,
	options = [],
}: {
	filter: FilterByField;
	filterType: FilterType;
	label: string;
	translator: Translator;
	options?: FilterOption[];
}): MappedFilterByField => {
	const filterKey = filter.name;

	return {
		key: snakeCase(filterKey),
		name: translator.gettext(label),
		type: filterType,
		filter: filterKey,
		isCustomField: false,
		options,
		operands: getOperands(filter, options),
	};
};

const getMappedFilter = (
	filter: FilterByField,
	translator: Translator,
): MappedFilterByField => {
	const filterKey = filter.name;
	const companyUsers = getUsers();
	const teams = getTeams();

	if (isTeamFilter(filterKey)) {
		return mapTeamFilter(filter, teams, translator);
	}

	const filterType = getMailFieldType(filterKey);
	const label = getMailFieldLabel(filterKey, translator);

	const filtersMap = {
		messageTime: getFilterOption({
			filter,
			filterType,
			label,
			translator,
		}),
		userId: getFilterOption({
			filter,
			filterType,
			label,
			options: companyUsers?.filter(
				(user: Pipedrive.User) => user.active_flag,
			),
			translator,
		}),
		type: getFilterOption({
			filter,
			filterType,
			label,
			options: getTypeOptions(translator),
			translator,
		}),
		openedTrackingStatus: getFilterOption({
			filter,
			filterType,
			label,
			options: getOpenedTrackingStatusOptions(translator),
			translator,
		}),
		openTime: getFilterOption({
			filter,
			filterType,
			label,
			translator,
		}),
		linkTrackingStatus: getFilterOption({
			filter,
			filterType,
			label,
			options: getLinkTrackingStatusOptions(translator),
			translator,
		}),
		linkClickedTime: getFilterOption({
			filter,
			filterType,
			label,
			translator,
		}),
	} as { [key: string]: MappedFilterByField };

	return filtersMap[filterKey];
};

const getMailsFiltersWithLabels = ({
	filters,
	translator,
}: {
	filters: FilterByField[];
	translator: Translator;
}) => {
	return filters.reduce((result, filter) => {
		const filterKey = filter.name;

		if (!WHITELISTED_MAILS_FILTERS.includes(filterKey)) {
			return result;
		}

		if (isTeamFilter(filterKey) && !areTeamsEnabled()) {
			return result;
		}

		result.push(getMappedFilter(filter, translator));

		return result;
	}, []);
};

export default memoize(getMailsFiltersWithLabels, {
	normalizer: (args) => {
		return JSON.stringify(args[0]?.filters);
	},
});
