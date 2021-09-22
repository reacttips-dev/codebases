import React, { useState, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useTranslator } from '@pipedrive/react-utils';

import useSettingsApi from '../../../hooks/useSettingsApi';
import { getReportTypeLabels } from '../../../utils/reportTypeUtils';
import { shouldCreateNewReport, getNewReportType } from './newReportFromUrl';
import InsightsWrapper from './InsightsWrapper';
import FullscreenSpinner from '../../../atoms/FullscreenSpinner/FullscreenSpinner';
import { selectedItemVar } from '../../../api/vars/settingsApi';
import { getCappings } from '../../../api/commands/capping';
import { getReportsLimitData } from '../../../shared/featureCapping/cappingUtils';
import localState from '../../../utils/localState';

const ReportCreatorFromUrl: React.FC = () => {
	const selectedItem = useReactiveVar(selectedItemVar);
	const { createReport } = useSettingsApi();
	const translator = useTranslator();

	const [isLoading, setIsLoading] = useState(true);

	const { cap: cappingLimit } = getCappings();
	const { getCurrentUserSettings } = localState();
	const { reports } = getCurrentUserSettings();
	const { hasReachedReportsLimit } = getReportsLimitData(
		reports,
		cappingLimit,
	);

	const createNewReport = async () => {
		const reportType = getNewReportType(selectedItem);
		const { newTitle } = getReportTypeLabels(reportType, translator);

		await createReport({
			name: newTitle,
			reportType,
		});

		setIsLoading(false);
	};

	useEffect(() => {
		setIsLoading(true);

		if (shouldCreateNewReport(selectedItem) && !hasReachedReportsLimit) {
			createNewReport();
		} else {
			setIsLoading(false);
		}
	}, [selectedItem.id]);

	if (isLoading) {
		return <FullscreenSpinner />;
	}

	return <InsightsWrapper selectedItem={selectedItem} />;
};

export default ReportCreatorFromUrl;
