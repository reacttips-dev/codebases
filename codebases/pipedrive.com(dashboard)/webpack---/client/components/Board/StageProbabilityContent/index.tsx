import React from 'react';
import ConditionalTooltip from '../../Shared/ConditionalTooltip';
import formatCurrency from '../../../utils/formatCurrency';
import { Container, TruncateContent } from './StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';
import StageHeaderTooltip from '../StageHeaderTooltip';

export interface StageProbabilityContentProps {
	summary?: Pipedrive.DealsByStagesSummaryPerStagesConverted;
	percentage: number;
	hasWeightedValue: boolean;
	element: React.MutableRefObject<HTMLDivElement>;
}

const StageProbabilityContent: React.FunctionComponent<StageProbabilityContentProps> = (props) => {
	const { summary, percentage, element, hasWeightedValue } = props;
	const translator = useTranslator();

	return (
		<ConditionalTooltip
			placement="bottom"
			portalTo={document.body}
			content={
				<StageHeaderTooltip summary={summary} hasWeightedValue={hasWeightedValue} percentage={percentage} />
			}
			innerRefProp="ref"
			condition
			popperProps={{
				modifiers: {
					preventOverflow: {
						enabled: true,
						padding: 8,
						boundariesElement: 'viewport',
					},
				},
			}}
		>
			<Container>
				<TruncateContent ref={element}>
					{translator.pgettext('5% of 2000EUR', '%s of %s', [
						`${percentage}%`,
						formatCurrency(summary.value, summary.currency),
					])}
				</TruncateContent>
			</Container>
		</ConditionalTooltip>
	);
};

export default StageProbabilityContent;
