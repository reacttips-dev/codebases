import React, { useContext } from 'react';
import { FFContextDataType, FormFieldsContext } from '@pipedrive/form-fields';
import { ReportBadLeadContext } from '@pipedrive/report-bad-lead';
import { MetricsProvider } from 'Utils/metrics/MetricsProvider';
import { PDMetrics } from '@pipedrive/react-utils';
import { WebappApiContext } from 'Components/WebappApiContext';

import { UIContextProvider } from './UIContext';

type Props = {
	readonly pdMetrics: PDMetrics;
	readonly ffContext: FFContextDataType;
	readonly children: React.ReactNode;
};

/**
 * This context component encapsulates other context solely for organization purposes. You should
 * add here only the contexts which are relevant for the whole Leads inbox.
 *
 * Ideally, this function should be similar to `TestApplicationContext` but for production code.
 */
export function LeadboxContextProvider({ children, pdMetrics, ffContext }: Props) {
	const { userSelf } = useContext(WebappApiContext);

	return (
		<MetricsProvider pdMetrics={pdMetrics}>
			<UIContextProvider>
				<FormFieldsContext.Provider value={ffContext}>
					<ReportBadLeadContext locale={userSelf.getLanguage()}>{children}</ReportBadLeadContext>
				</FormFieldsContext.Provider>
			</UIContextProvider>
		</MetricsProvider>
	);
}
