import React from 'react';
import styled from 'styled-components';
import { PDMetrics, useTranslator } from '@pipedrive/react-utils';
import useToolsContext from '../hooks/useToolsContext';
import { HeaderTooltip } from './Header';
import { HeaderIcon } from './Header/styled';
import useUserDataContext from '../hooks/useUserDataContext';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';

const TEAMS_INVITE_PATH = '/settings/users/add';

export enum TeamsInvite {
	Header = 2,
}

const TeamsInviteIcon = (props) => {
	return (
		<svg width="24" height="18" viewBox="0 0 24 18" fill="none">
			<path d="M4.25 2.75V0H2.75V2.75H0V4.25H2.75V7H4.25V4.25H7V2.75H4.25Z" {...props} />
			<path
				d="M4 16.2418C4 14.0875 8.27281 13.0023 10.4161 13C12.5456 13.0023 16.8047 14.0875 16.8047 16.2418V18H4V16.2418Z"
				{...props}
			/>
			<path d="M10.4161 13L10.423 13H10.4092L10.4161 13Z" {...props} />
			<path
				d="M16.7124 13.0417L17.6045 13C19.7455 13 24 14.0852 24 16.2418V18H18.5103V16.2418C18.5103 14.8644 17.7692 13.8209 16.7124 13.0417Z"
				{...props}
			/>
			<path
				d="M19.6945 9.69454C19.1788 10.2103 18.4793 10.5 17.75 10.5C17.2061 10.5 16.6744 10.3387 16.2222 10.0365C15.7699 9.73437 15.4175 9.30488 15.2093 8.80238C15.0012 8.29988 14.9467 7.74695 15.0528 7.2135C15.159 6.68005 15.4209 6.19005 15.8055 5.80546C16.1901 5.42086 16.6801 5.15895 17.2135 5.05284C17.7469 4.94673 18.2999 5.00119 18.8024 5.20933C19.3049 5.41747 19.7344 5.76995 20.0365 6.22218C20.3387 6.67442 20.5 7.2061 20.5 7.75C20.5 8.47935 20.2103 9.17882 19.6945 9.69454Z"
				{...props}
			/>
			<path
				d="M8.96449 10.0365C9.41673 10.3387 9.94841 10.5 10.4923 10.5C11.2217 10.5 11.9211 10.2103 12.4369 9.69454C12.9526 9.17882 13.2423 8.47935 13.2423 7.75C13.2423 7.2061 13.081 6.67442 12.7789 6.22218C12.4767 5.76995 12.0472 5.41747 11.5447 5.20933C11.0422 5.00119 10.4893 4.94673 9.95581 5.05284C9.42236 5.15895 8.93236 5.42086 8.54777 5.80546C8.16317 6.19005 7.90126 6.68005 7.79515 7.2135C7.68904 7.74695 7.7435 8.29988 7.95164 8.80238C8.15978 9.30488 8.51226 9.73437 8.96449 10.0365Z"
				{...props}
			/>
		</svg>
	);
};

const HeaderTeamsInviteIconWrapper = styled.div`
	svg {
		fill: ${colors['$color-black-hex-64']};
	}
	&:hover {
		svg {
			fill: ${colors['$color-black-hex-88']};
		}
	}
`;

const trackAddUsersEvent = (metrics: PDMetrics, from: string) => {
	metrics?.trackUsage(null, 'add_users', 'clicked', {
		from,
	});
};

export const HeaderTeamsInviteButton = () => {
	const translator = useTranslator();
	const { router, metrics } = useToolsContext();
	const { signupData } = useUserDataContext();
	const inviteYourTeam = translator.gettext('Invite your team');

	if (signupData?.data?.hvtAbTestVersion !== TeamsInvite.Header) {
		return null;
	}

	return (
		<HeaderTooltip content={inviteYourTeam}>
			<HeaderTeamsInviteIconWrapper>
				<HeaderIcon
					onClick={() => {
						router.navigateTo(TEAMS_INVITE_PATH);
						trackAddUsersEvent(metrics, 'header');
					}}
					aria-label={inviteYourTeam}
					tabIndex={0}
					yellow={false}
					active={false}
					lastItem={false}
				>
					<TeamsInviteIcon />
				</HeaderIcon>
			</HeaderTeamsInviteIconWrapper>
		</HeaderTooltip>
	);
};
