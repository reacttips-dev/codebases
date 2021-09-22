import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { ReportOptions } from '../types/report-options';
import localState from '../utils/localState';

export default (dataType: insightsTypes.DataType): ReportOptions => {
	const translator = useTranslator();
	const { getReportOptions } = localState();

	return getReportOptions(translator)[dataType];
};
