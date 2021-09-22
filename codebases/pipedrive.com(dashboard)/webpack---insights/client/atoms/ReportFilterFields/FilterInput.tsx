import React from 'react';
import { Input } from '@pipedrive/convention-ui-react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { FilterTypenameType } from '../../utils/constants';

const FilterInput = ({
	operand,
	data,
	onFilterChange,
	canSeeCurrentReport,
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

	const inputChanged = (newValue: string) => {
		onFilterChange({
			operands: [
				{
					name: operand.name,
					defaultValue: newValue,
					__typename: FilterTypenameType.SELECTED_OPERAND,
				},
			],
		});
	};

	return (
		<Input
			type="text"
			onChange={(e) => inputChanged(e.target.value)}
			value={inputValue}
			disabled={!canSeeCurrentReport}
		/>
	);
};

export default FilterInput;
