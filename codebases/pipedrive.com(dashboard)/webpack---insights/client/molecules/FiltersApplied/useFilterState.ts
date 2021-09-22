import update from 'immutability-helper';

import { removeTypenames } from '../../utils/responseUtils';
import localState from '../../utils/localState';

export default (filterByFilters: any) => {
	const { setUnsavedReport } = localState();

	const saveChanges = (filters: any) => {
		setUnsavedReport({
			parameters: {
				filter_by: removeTypenames(filters),
				__typename: 'reportreportParametersInput',
			},
		});
	};

	return {
		addReportFilter: (newFilter: any) => {
			saveChanges([...filterByFilters, newFilter]);
		},
		editReportFilter: (filterIndex: number, newFilter: any) => {
			saveChanges(
				update(filterByFilters, {
					[filterIndex]: {
						$set: {
							...filterByFilters[filterIndex],
							...newFilter,
						},
					},
				}),
			);
		},
		deleteReportFilter: (filterIndex: number) => {
			saveChanges(
				update(filterByFilters, {
					$splice: [[filterIndex, 1]],
				}),
			);
		},
	};
};
