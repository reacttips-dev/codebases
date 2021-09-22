import React from 'react';
import { Icon, Spacing } from '@pipedrive/convention-ui-react';
import formatCurrency from '../../../utils/formatCurrency';
import { Column } from './StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';

type TotalSummaryPopoverContentProps = {
	summary?: Pipedrive.DealsSummaryData;
};

const TotalSummaryPopoverContent: React.FunctionComponent<TotalSummaryPopoverContentProps> = (props) => {
	const translator = useTranslator();

	return (
		<Spacing horizontal="m" vertical="s" data-test="summary-popover">
			<table>
				<tbody>
					{Object.keys(props.summary.values_total).map((currency) => {
						const value = formatCurrency(props.summary.values_total[currency].value, currency);
						const weightedValue = formatCurrency(
							props.summary.weighted_values_total[currency].value,
							currency,
						);
						const count = props.summary.values_total[currency].count;

						return (
							<tr key={currency}>
								<Column>{value}</Column>
								<Column>
									<Icon icon="weighted" size="s" />
									{weightedValue}
								</Column>
								<Column>
									{translator.gettext(translator.ngettext('%d deal', '%d deals', count), count)}
								</Column>
							</tr>
						);
					})}
				</tbody>
			</table>
		</Spacing>
	);
};

export default TotalSummaryPopoverContent;
