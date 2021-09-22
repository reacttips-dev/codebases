import { round } from 'lodash';
import React, { useRef } from 'react';
import formatCurrency from '../../../utils/formatCurrency';
import StageProbabilityContent from '../StageProbabilityContent';
import StageSummaryContent from '../StageSummaryContent';
import { Container } from './StyledComponents';

export interface StageSummaryProps {
	summary?: Pipedrive.DealsByStagesSummaryPerStagesConverted;
	isHovering?: boolean;
}

const StageSummary: React.FunctionComponent<StageSummaryProps> = (props) => {
	const { summary, isHovering } = props;

	const probabilityContentElement = useRef(null);
	const summaryContentElement = useRef(null);

	if (!summary || !summary.count || summary.count === 0) {
		return (
			<Container data-test="stage-summary">
				<span>{formatCurrency(0)}</span>
			</Container>
		);
	}

	const percentage = round(100 * (summary.value_weighted / summary.value), 0);
	const hasWeightedValue = summary.value_weighted !== summary.value;

	return (
		<Container data-test="stage-summary">
			{hasWeightedValue && isHovering ? (
				<StageProbabilityContent
					summary={summary}
					percentage={percentage}
					hasWeightedValue={hasWeightedValue}
					element={probabilityContentElement}
				/>
			) : (
				<StageSummaryContent
					summary={summary}
					percentage={percentage}
					hasWeightedValue={hasWeightedValue}
					element={summaryContentElement}
				/>
			)}
		</Container>
	);
};

export default StageSummary;
