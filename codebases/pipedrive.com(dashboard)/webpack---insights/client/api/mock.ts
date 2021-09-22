// eslint-disable-next-line import/prefer-default-export
export const selectedDataFilters = {
	userFilters: [
		{
			filter: 'addTime',
			type: 'date',
			operands: [
				{
					name: 'is more than',
					defaultValue: '2019-01-01',
					__typename: 'SelectedDataFilterOperand',
				},
				{
					name: 'is less than',
					defaultValue: '2019-12-31',
					__typename: 'SelectedDataFilterOperand',
				},
				{
					name: 'format',
					defaultValue: 'yyyy-MM-dd',
					__typename: 'SelectedDataFilterOperand',
				},
			],
			period: 'year',
			__typename: 'SelectedDataFilter',
		},
	],
	__typename: 'SelectedDataFilters',
};
