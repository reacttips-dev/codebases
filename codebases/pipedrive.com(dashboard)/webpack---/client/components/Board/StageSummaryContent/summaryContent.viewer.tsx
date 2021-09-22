import React from 'react';
import formatCurrency from '../../../utils/formatCurrency';
import { SummarySeparator, TruncateContent } from './StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';
import { isNil } from 'lodash';

export interface Props {
	summary?: Pipedrive.DealsByStagesSummaryPerStagesConverted;
}

const ViewerStageSummaryContent: React.FunctionComponent<Props> = ({ summary }) => {
	const translator = useTranslator();
	const value = summary.value;
	const count = summary.count;

	return (
		<TruncateContent data-test="stage-summary">
			{!isNil(value) && <span>{formatCurrency(value, summary.currency)}</span>}
			{!isNil(value) && !isNil(count) && <SummarySeparator>&middot;</SummarySeparator>}
			{!isNil(count) && (
				<span>
					{translator.gettext(translator.ngettext('%d deal', '%d deals', summary.count), summary.count)}
				</span>
			)}
		</TruncateContent>
	);
};

export default ViewerStageSummaryContent;
