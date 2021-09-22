import React from 'react';
import formatCurrency from '../../../utils/formatCurrency';
import { Container } from './StyledComponents';
import ViewerStageSummaryContent from '../StageSummaryContent/summaryContent.viewer';

export interface StageSummaryProps {
	summary?: Pipedrive.DealsByStagesSummaryPerStagesConverted;
}

const ViewerStageSummary: React.FunctionComponent<StageSummaryProps> = ({ summary }) => {
	if (!summary || summary.count === 0) {
		return (
			<Container data-test="stage-summary">
				<span>{formatCurrency(0, null)}</span>
			</Container>
		);
	}

	return <ViewerStageSummaryContent summary={summary} />;
};

export default ViewerStageSummary;
