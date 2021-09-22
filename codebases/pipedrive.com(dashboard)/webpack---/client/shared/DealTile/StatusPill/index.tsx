import { PillProps, Tooltip, TooltipProps } from '@pipedrive/convention-ui-react';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React from 'react';
import { StyledPill, StatusPillContainer } from './StyledComponents';
import { useTranslator, Translator } from '@pipedrive/react-utils';
import { isDealLost, isDealRotten, isDealWon } from '../../../utils/dealStatus';

export interface StatusPillProps {
	deal: Pipedrive.Deal;
}

export interface ExtendedPillProps extends PillProps {
	lowercase?: boolean;
}

const getPillAndTooltipProps = (
	deal: Pipedrive.Deal,
	translator: Translator,
): [ExtendedPillProps, TooltipProps | null] => {
	if (isDealRotten(deal)) {
		const rottenTime = moment.utc(deal.rotten_time).local();
		const days = Math.abs(moment().diff(rottenTime, 'days'));
		const daysFormatted = days < 1 ? '<1' : days;

		return [
			{
				children: `${daysFormatted}${translator.pgettext('An abbreviation for Day/Days', 'D')}`,
				color: 'red',
				lowercase: true,
			},
			{
				placement: 'bottom',
				popperProps: {
					modifiers: {
						preventOverflow: {
							enabled: true,
							padding: 20,
							boundariesElement: document.body,
						},
					},
				},
				portalTo: document.body,
				content: translator.ngettext('No actions for %s day', 'No actions for %s days', days, daysFormatted),
			},
		];
	}

	if (isDealLost(deal)) {
		return [
			{
				children: translator.gettext('Lost'),
				outline: true,
			},
			null,
		];
	}

	if (isDealWon(deal)) {
		return [
			{
				color: 'green',
				children: translator.gettext('Won'),
			},
			null,
		];
	}

	return [null, null];
};

const StatusPill: React.FunctionComponent<StatusPillProps> = (props) => {
	const { deal } = props;
	const translator = useTranslator();

	const [pillProps, tooltipProps] = getPillAndTooltipProps(deal, translator);

	if (isEmpty(pillProps)) {
		return null;
	}

	return (
		<StatusPillContainer>
			{!isEmpty(tooltipProps) && (
				<Tooltip {...tooltipProps}>
					<StyledPill size="s" {...pillProps} />
				</Tooltip>
			)}

			{isEmpty(tooltipProps) && <StyledPill size="s" {...pillProps} />}
		</StatusPillContainer>
	);
};

export default StatusPill;
