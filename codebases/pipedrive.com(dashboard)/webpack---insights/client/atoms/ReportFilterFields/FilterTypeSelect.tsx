import React, { useEffect } from 'react';
import { Select, Separator } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import {
	getMainFilters,
	getDateFilters,
	getCustomFieldsFilters,
} from '../../utils/filterUtils';
import { isCustomFieldsIndicesFlagEnabled } from '../../api/webapp';

import styles from './ReportFilterFields.pcss';

interface FilterTypeSelectProps {
	data: any;
	filtersList: any;
	filterChanged: any;
	isFilterDisabled: boolean;
	isSelectOpened?: boolean;
}

const FilterTypeSelect: React.FC<FilterTypeSelectProps> = ({
	data,
	filtersList,
	filterChanged,
	isFilterDisabled,
	isSelectOpened,
}) => {
	const translator = useTranslator();

	const mainFilters = getMainFilters(filtersList);
	const dateFilters = getDateFilters(filtersList);
	const customFieldsFilters = getCustomFieldsFilters(filtersList);

	const renderOptions = (array: any, disabled: boolean) => {
		return array.map((filter: any, key: number) => (
			<Select.Option
				value={filter.filter}
				key={String(key)}
				disabled={disabled}
				data-test={`filter-select-option-${filter.key}`}
			>
				{filter.name}
			</Select.Option>
		));
	};

	const renderMainFiltersBlock = () => {
		return (
			<>
				<Separator type="block">
					{translator.gettext('Other fields')}
				</Separator>
				{renderOptions(mainFilters, false)}
			</>
		);
	};

	const renderDateFiltersBlock = () => {
		if (dateFilters.length === 0) {
			return null;
		}

		return (
			<>
				<Separator type="block">
					{translator.gettext('Date fields')}
				</Separator>
				{renderOptions(dateFilters, false)}
			</>
		);
	};

	const renderCustomFiltersBlock = () => {
		if (customFieldsFilters.length === 0) {
			return null;
		}

		const separatorText = isCustomFieldsIndicesFlagEnabled()
			? translator.gettext('Custom fields')
			: translator.gettext('Custom fields (Professional plan)');

		return (
			<>
				<Separator type="block">{separatorText}</Separator>
				{renderOptions(
					customFieldsFilters,
					!isCustomFieldsIndicesFlagEnabled(),
				)}
			</>
		);
	};

	/**
	 * IL-155: portalTo is conflicting with input ref in CUI and it breaks autofocus.
	 * This is a temporary fix until CUI provides inputProps for the Select.
	 */
	useEffect(() => {
		document
			.querySelector<HTMLInputElement>(`.${styles.options} input`)
			?.focus();
	});

	return (
		<Select
			filter
			className={styles.select}
			popupClassName={styles.options}
			onChange={(value: string) => filterChanged(value)}
			value={data.filter}
			placement="bottom-start"
			portalTo={document.body}
			disabled={isFilterDisabled}
			popperProps={{
				modifiers: {
					preventOverflow: { enabled: false },
				},
			}}
			downShiftProps={{
				defaultIsOpen: isSelectOpened,
			}}
			data-test="reports-filter-select"
		>
			{renderCustomFiltersBlock()}
			{renderMainFiltersBlock()}
			{renderDateFiltersBlock()}
		</Select>
	);
};

export default FilterTypeSelect;
