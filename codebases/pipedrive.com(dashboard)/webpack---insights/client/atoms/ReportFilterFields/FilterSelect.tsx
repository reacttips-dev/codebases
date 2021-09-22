import React from 'react';
import { isNil } from 'lodash';
import { Select, Separator } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { ChartType, Filter, Operand } from '@pipedrive/insights-core/lib/types';

import useFilterState from '../../molecules/VisualBuilder/useFilterState';
import { FilterType, FilterTypenameType } from '../../utils/constants';
import { getPipelineStagesById } from '../../utils/filterUtils';
import { getUsers } from '../../api/webapp';

import styles from './ReportFilterFields.pcss';

interface FilterSelectProps {
	data: Filter;
	operand: Operand;
	filtersList: Filter[];
	onFilterChange: (filter: Filter) => void;
	isMultiSelect: boolean;
	canSeeCurrentReport: boolean;
	chartType: ChartType;
	isFilterSelectDisabled: boolean;
	unavailableOptions: string[];
}

const FilterSelect = ({
	data,
	operand,
	filtersList,
	onFilterChange,
	isMultiSelect,
	canSeeCurrentReport,
	chartType,
	isFilterSelectDisabled,
	unavailableOptions,
}: FilterSelectProps) => {
	const translator = useTranslator();
	const { setStagesFilter } = useFilterState();
	const cantSeeOtherUsers = data.filter === 'userId' && getUsers() === 1;
	const filter = filtersList.find(
		(filterItem: any) => filterItem.filter === data.filter,
	);

	const selectOptionsChanged = (newValue: number) => {
		onFilterChange({
			operands: [
				{
					name: operand.name,
					defaultValue: newValue,
					__typename: FilterTypenameType.SELECTED_OPERAND,
				},
			],
		});

		// when changing the pipeline in filters for funnel conversion report,
		// set the new pipeline stages for multiselect filter in chart
		if (
			data.type === FilterType.PIPELINE &&
			chartType === ChartType.FUNNEL
		) {
			const newPipelineStages = getPipelineStagesById(newValue);
			const newPipelineStagesIds = newPipelineStages.map(
				(stage) => stage.id,
			);

			setStagesFilter(newPipelineStagesIds);
		}
	};

	const isCurrencyFilter = filter && filter.type === FilterType.CURRENCY;

	const getOptionValue = (option: any) => {
		if (!option) {
			return [];
		}

		return isCurrencyFilter ? option.code : option.id;
	};

	const renderSelectOptions = () => {
		const filteredOptions = filter?.options?.filter((option: any) => {
			return !unavailableOptions?.includes(option.id);
		});

		if (filter.type === FilterType.STAGE && filteredOptions) {
			const stagesPerPipeline = filteredOptions[0];

			let options = [] as React.ReactNode[];

			Object.keys(stagesPerPipeline)?.forEach((pipelineId) => {
				const pipeline = stagesPerPipeline[pipelineId];

				options.push(
					<Separator type="block">
						{pipeline[0].pipeline_name}
					</Separator>,
				);

				const stages = pipeline.map((stage: Pipedrive.Stage) => (
					<Select.Option
						key={stage.id}
						value={stage.id}
						data-test={`${filter.key}-select-option-${stage.name}`}
					>
						{stage.name}
					</Select.Option>
				));

				options = [...options, ...stages];
			});

			return options;
		}

		return filteredOptions?.map((option: any) => {
			const optionId = getOptionValue(option);
			const optionLabel = option.label || option.name;

			return (
				<Select.Option
					key={optionId}
					value={optionId}
					data-test={`${filter.key}-select-option-${optionLabel}`}
				>
					{optionLabel}
				</Select.Option>
			);
		});
	};

	const getFilterValue = () => {
		/*
		 Some enum type filters have booleans as values (e.g. activities busyFlag). That is why
		 it is important to only check whether defaultValue is null or undefined
		*/
		return isNil(operand.defaultValue) ? [] : operand.defaultValue;
	};

	return (
		<Select
			filter
			placeholder={translator.gettext('select value')}
			className={styles.select}
			disabled={
				cantSeeOtherUsers ||
				!canSeeCurrentReport ||
				isFilterSelectDisabled
			}
			popupClassName={styles.options}
			multiple={isMultiSelect as any}
			onChange={(newValue: number) => {
				selectOptionsChanged(newValue);
			}}
			value={getFilterValue()}
			popperProps={{
				modifiers: {
					preventOverflow: { enabled: false },
				},
			}}
			portalTo={document.body}
			data-test={`filter-${filter.key}-select`}
		>
			{renderSelectOptions()}
		</Select>
	);
};

export default FilterSelect;
