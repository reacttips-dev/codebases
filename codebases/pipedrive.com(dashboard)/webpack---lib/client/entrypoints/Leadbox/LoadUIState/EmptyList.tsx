import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Text } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import styled from 'styled-components';
import { LeadboxRoutes } from 'Utils/LeadboxRoutes';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';
import { useSetUserSettingMutation } from 'Leadbox/ActionBar/SetUserSettingMutation';
import { UserSettingFilterKeys } from 'Leadbox/UserSettingFilterKeys';

const NoLeadsWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	background-color: ${colors.white};
	border-bottom: solid 1px ${colors.black8};
	border-top: solid 1px ${colors.black8};
`;

export const Content = styled(Text)`
	padding: 100px 0;

	p {
		color: ${colors.black64};
		margin: 0 auto 32px;

		span {
			color: ${colors.blue};
			cursor: pointer;
		}
	}
`;

export const EmptyList = () => {
	const translator = useTranslator();
	const inboxFilters = useContext(LeadboxFiltersContext);
	const setUserSetting = useSetUserSettingMutation();

	const resetUserSetting = () => {
		setUserSetting(UserSettingFilterKeys.FILTER, null);
		setUserSetting(UserSettingFilterKeys.LABEL, null);
		setUserSetting(UserSettingFilterKeys.SOURCE, null);
	};

	const handleFilterResetClick = () => {
		inboxFilters.reset();
		resetUserSetting();
	};

	return (
		<NoLeadsWrapper>
			<Content>
				<h1>{translator.gettext('No leads found to match your criteria')}</h1>
				<p>
					{translator.gettext('Try resetting your filters or')}
					&nbsp;
					<Link to={`/leads${LeadboxRoutes.Inbox}`} onClick={handleFilterResetClick}>
						{translator.gettext('see all your leads')}
					</Link>
				</p>
			</Content>
		</NoLeadsWrapper>
	);
};
