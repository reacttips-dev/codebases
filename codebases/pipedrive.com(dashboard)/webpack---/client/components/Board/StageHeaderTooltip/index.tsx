import React from 'react';
import formatCurrency from '../../../utils/formatCurrency';
import { SummarySeparator } from '../StageSummaryContent/StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';

export interface StageHeaderTooltipProps {
	summary?: Pipedrive.DealsByStagesSummaryPerStagesConverted;
	percentage?: number;
	hasWeightedValue: boolean;
}

const StageHeaderTooltip: React.FunctionComponent<StageHeaderTooltipProps> = (props) => {
	const { summary, hasWeightedValue, percentage } = props;
	const currencies = Object.keys(summary.details);
	const showDetails = !(currencies.length === 1 && currencies[0] === summary.currency);
	const translator = useTranslator();

	return (
		<span>
			{hasWeightedValue ? (
				<div>
					<div style={{ fontWeight: 600 }}>{`${translator.gettext('Total')}`}</div>
					{formatCurrency(summary.value_weighted, summary.currency)}
					<SummarySeparator>&middot;</SummarySeparator>
					{translator.pgettext('5% of 2000EUR', '%s of %s', [
						`${percentage}%`,
						formatCurrency(summary.value, summary.currency),
					])}
				</div>
			) : (
				<div>
					<div style={{ fontWeight: 600 }}>{`${translator.gettext('Total')}`}</div>
					{`${formatCurrency(summary.value_weighted, summary.currency)}`}
					<SummarySeparator>&middot;</SummarySeparator>
					{`${translator.gettext(translator.ngettext('%d deal', '%d deals', summary.count), summary.count)}`}
				</div>
			)}

			{showDetails && (
				<div>
					<div style={{ marginTop: '8px', fontWeight: 600 }}>{`${translator.gettext('By currency')}`}</div>
					{currencies.map((currency) => {
						const details = summary.details[currency];

						return (
							<div key={currency}>
								{formatCurrency(details.weighted_value, currency)}
								<SummarySeparator>&middot;</SummarySeparator>
								{translator.gettext(
									translator.ngettext('%d deal', '%d deals', details.count),
									details.count,
								)}
								{hasWeightedValue && (
									<>
										<SummarySeparator>&middot;</SummarySeparator>
										{translator.pgettext('5% of 2000EUR', '%s of %s', [
											`${percentage}%`,
											formatCurrency(details.value, currency),
										])}
									</>
								)}
							</div>
						);
					})}
				</div>
			)}
		</span>
	);
};

export default StageHeaderTooltip;
