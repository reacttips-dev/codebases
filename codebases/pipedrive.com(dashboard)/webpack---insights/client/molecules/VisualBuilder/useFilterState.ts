import localState from '../../utils/localState';
import { NO_SEGMENT } from '../../utils/constants';

export default () => {
	const { setUnsavedReport } = localState();

	const saveChanges = (name: string, filter: any, segment = false) => {
		setUnsavedReport({
			segment_set: segment && filter !== NO_SEGMENT,
			parameters: {
				[name]: filter,
				__typename: 'reportreportParametersInput',
			},
		});
	};

	return {
		setGroupByFilter: (filter: string, interval = false) => {
			saveChanges('group_by', { filter, interval });
		},
		setMeasureByFilter: (filter: string) => {
			saveChanges('measure_by', filter);
		},
		setSegmentByFilter: (filter: string) => {
			saveChanges('segment_by', filter, true);
		},
		setStagesFilter: (stages: number[]) => {
			saveChanges('stages', stages);
		},
		setIsCumulativeFilter: (isCumulative: boolean) => {
			saveChanges('is_cumulative', isCumulative);
		},
	};
};
