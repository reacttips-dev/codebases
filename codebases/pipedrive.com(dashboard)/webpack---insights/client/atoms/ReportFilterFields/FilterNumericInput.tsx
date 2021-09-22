import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { Input } from '@pipedrive/convention-ui-react';

import { FilterTypenameType } from '../../utils/constants';

const FilterNumericInput = ({
	operand,
	data,
	onFilterChange,
	canSeeCurrentReport,
	dontAllowNegativeValues,
}: {
	operand: insightsTypes.Operand;
	data: insightsTypes.Filter;
	onFilterChange: (value: any) => void;
	canSeeCurrentReport: boolean;
	dontAllowNegativeValues?: boolean;
}) => {
	const inputValue = data.operands.find(
		(o) => o.name === operand.name,
	).defaultValue;

	const inputChanged = (newValue: number | string) => {
		onFilterChange({
			operands: [
				{
					name: operand.name,
					defaultValue: Number(newValue),
					__typename: FilterTypenameType.SELECTED_OPERAND,
				},
			],
		});
	};

	return (
		<Input
			type="number"
			onChange={(e) => inputChanged(e.target.value)}
			value={inputValue}
			disabled={!canSeeCurrentReport}
			{...(dontAllowNegativeValues ? { min: 0 } : {})}
		/>
	);
};

export default FilterNumericInput;
