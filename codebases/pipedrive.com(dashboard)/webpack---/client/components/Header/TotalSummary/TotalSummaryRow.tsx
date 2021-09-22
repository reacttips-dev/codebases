import React, { Fragment } from 'react';
import { Icon } from '@pipedrive/convention-ui-react';
import formatCurrency from '../../../utils/formatCurrency';
import { TruncateContainer, SummarySeparator } from './StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';
import { getUserSetting } from '../../../shared/api/webapp';

export type TotalSummaryRowProps = {
	summary: Pipedrive.TotalSummary;
};

const TotalSummaryRow: React.FunctionComponent<TotalSummaryRowProps> = (props) => {
	const translator = useTranslator();
	const { summary } = props;

	const canSeeDealsListSummary = getUserSetting('can_see_deals_list_summary');
	const hasWeightedValue =
		!!props.summary.total_weighted_currency_converted_value &&
		formatCurrency(props.summary.total_weighted_currency_converted_value) !==
			formatCurrency(props.summary.total_currency_converted_value);

	if (hasWeightedValue) {
		return (
			<TruncateContainer>
				{canSeeDealsListSummary && (
					<Fragment>
						{formatCurrency(summary.total_currency_converted_value)}
						<SummarySeparator>&middot;</SummarySeparator>
						<Icon icon="weighted" size="s" />
						{formatCurrency(summary.total_weighted_currency_converted_value)}
						<SummarySeparator>&middot;</SummarySeparator>
					</Fragment>
				)}
				{translator.gettext(
					translator.ngettext('%d deal', '%d deals', summary.total_count),
					summary.total_count,
				)}
			</TruncateContainer>
		);
	}

	return (
		<TruncateContainer>
			{canSeeDealsListSummary && (
				<Fragment>
					{formatCurrency(summary.total_currency_converted_value)}
					<SummarySeparator>&middot;</SummarySeparator>
				</Fragment>
			)}
			{translator.gettext(translator.ngettext('%d deal', '%d deals', summary.total_count), summary.total_count)}
		</TruncateContainer>
	);
};

export default TotalSummaryRow;
