import React from 'react';
import ConditionalTooltip from '../../Shared/ConditionalTooltip';
import { Icon } from '@pipedrive/convention-ui-react';
import formatCurrency from '../../../utils/formatCurrency';
import { SummarySeparator, Container, WeightedIcon, TruncateContent } from './StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';
import StageHeaderTooltip from '../StageHeaderTooltip';

export interface StageSummaryContentProps {
	summary?: Pipedrive.DealsByStagesSummaryPerStagesConverted;
	percentage: number;
	hasWeightedValue: boolean;
	element: React.MutableRefObject<HTMLDivElement>;
}
export const popoverProps = {
	modifiers: {
		preventOverflow: {
			enabled: true,
			padding: 8,
			boundariesElement: 'viewport',
		},
	},
};

const StageSummaryContent: React.FunctionComponent<StageSummaryContentProps> = (props) => {
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
			// @ts-expect-error `boundariesElement: 'viewport'` type signature mismatch
			popperProps={popoverProps}
		>
			<Container>
				{hasWeightedValue && (
					<WeightedIcon>
						<Icon icon="weighted" size="s" />
					</WeightedIcon>
				)}
				<TruncateContent ref={element}>
					<span>
						{hasWeightedValue
							? formatCurrency(summary.value_weighted, summary.currency)
							: formatCurrency(summary.value, summary.currency)}
					</span>
					<SummarySeparator>&middot;</SummarySeparator>
					<span>
						{translator.gettext(translator.ngettext('%d deal', '%d deals', summary.count), summary.count)}
					</span>
				</TruncateContent>
			</Container>
		</ConditionalTooltip>
	);
};

export default StageSummaryContent;
