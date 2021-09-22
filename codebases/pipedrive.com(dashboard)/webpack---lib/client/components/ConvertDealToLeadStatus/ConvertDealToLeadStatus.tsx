import React, { useContext, useEffect, useCallback } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { ProgressPanel } from 'Components/ProgressPanel';
import { ErrorPanel } from 'Components/ErrorPanel';
import { getConvertingFinishedData } from 'Utils/metrics/convertModal';
import { WebappApiContext } from 'Components/WebappApiContext';

import { useConvertDealToLeadProgress } from './useConvertDealToLeadProgress';
import { useConvertDealToLeadSession } from './useConvertDealToLeadSession';

export const ConvertDealToLeadStatus: React.FC<{
	readonly relayRefetch: () => void;
}> = ({ relayRefetch }) => {
	const t = useTranslator();
	const { trackUsage } = useContext(WebappApiContext);
	const [convertSession, setConvertSession, clearStorage] = useConvertDealToLeadSession();

	const { dealsProcessed, dealsFailed, isFinished, percentage } = useConvertDealToLeadProgress(convertSession);

	const sendTrackingCallback = useCallback(() => {
		const trackingData = getConvertingFinishedData(dealsProcessed, dealsFailed);
		trackUsage('leads', 'deal_to_lead_conversion', 'finished', trackingData);
	}, [dealsFailed, dealsProcessed, trackUsage]);

	const onCloseHandler = useCallback(() => {
		setConvertSession(null);
		clearStorage();
		sendTrackingCallback();
	}, [clearStorage, sendTrackingCallback, setConvertSession]);

	useEffect(() => {
		if (isFinished && convertSession) {
			relayRefetch();
			onCloseHandler();
		}
	}, [onCloseHandler, isFinished, convertSession, relayRefetch]);

	if (!convertSession) {
		return null;
	}

	const titleMessage = `${t.gettext('Converting deals to leads')} (${dealsProcessed}/${convertSession.total})`;

	const textContent = t.gettext(`When finished your converted leads will automatically appear below. We will
	also notify you via email when it’s all done.`);

	if (isFinished && dealsFailed) {
		return (
			<ErrorPanel messageTitle={t.gettext('Converting failed for some deals.')} dismissHandler={clearStorage} />
		);
	}

	if (isFinished) {
		return null;
	}

	return (
		<ProgressPanel
			heading={titleMessage}
			subHeading={textContent}
			percentage={percentage}
			onClose={onCloseHandler}
		/>
	);
};
