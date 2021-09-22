import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from '@pipedrive/convention-ui-react';
import { Marksome } from 'react-marksome';

import { withWebApiAndTranslatorLoader } from '../../utils/hocs';
import getBannerItems, {
	isWarningVisible,
	isReauthModalVisible,
	isReauthBannerVisible,
} from './helpers';
import {
	trackCalendarSyncReauthWarningClicked,
	trackCalendarSyncReauthWarningClosed,
	trackCalendarSyncReauthWarningSeen,
} from './tracking';
import ReauthModal from './modal';
import { checkActiveSync } from '../../api';

// cui message recalculates height on window resize which breaks activities page layout
const CuiMessage = styled(Message)`
	${(p) => (p.visible ? 'min-height: 47px;' : null)}
`;

const ActivityGlobalMessages = ({ webappApi, translator }) => {
	const userSettings = webappApi.userSelf.settings;
	const [warningVisible, setWarningVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const { warningText, closable } = getBannerItems(userSettings, translator);
	const showReauthBanner = isReauthBannerVisible(userSettings);

	useEffect(() => {
		async function checkSync() {
			const hasActiveNylasSync = await checkActiveSync(
				'/api/calendar-sync/v1/accounts/sync/active',
			).catch(() => false);

			if (isWarningVisible(userSettings, hasActiveNylasSync)) {
				setWarningVisible(true);
				trackCalendarSyncReauthWarningSeen(webappApi);
			}

			if (hasActiveNylasSync && isReauthModalVisible(userSettings)) {
				setModalVisible(true);
			}
		}

		checkSync();
	}, []);

	const onBannerClose = () => {
		userSettings.save(
			{ show_calendar_sync_reauthentication_warning: false },
			{
				success: () => {
					trackCalendarSyncReauthWarningClosed(webappApi);
					setWarningVisible(false);
				},
			},
		);
	};

	const getContent = () => {
		if (showReauthBanner) {
			return (
				<Marksome
					text={warningText}
					references={{
						'calendar-settings-page': function Link(children) {
							return (
								<a
									href="/settings/calendar-sync"
									onClick={() =>
										trackCalendarSyncReauthWarningClicked(webappApi, true)
									}
								>
									{children}
								</a>
							);
						},
						'open-reauth-modal': function Link(children) {
							return (
								<a
									href="#"
									onClick={() => {
										setModalVisible(true);
										trackCalendarSyncReauthWarningSeen(webappApi);
									}}
								>
									{children}
								</a>
							);
						},
					}}
				/>
			);
		}

		return (
			<Marksome
				text={warningText}
				references={{
					'calendar-settings-page': function Link(children) {
						return (
							<a
								href="/settings/calendar-sync"
								onClick={() => trackCalendarSyncReauthWarningClicked(webappApi)}
							>
								{children}
							</a>
						);
					},
				}}
			/>
		);
	};

	return (
		<>
			{modalVisible && (
				<ReauthModal
					visible={modalVisible}
					setVisible={setModalVisible}
					translator={translator}
					webappApi={webappApi}
				/>
			)}
			{warningVisible && (
				<CuiMessage
					icon="warning"
					color="yellow"
					visible={warningVisible}
					alternative
					onClose={closable ? () => onBannerClose() : null}
				>
					{getContent()}
				</CuiMessage>
			)}
		</>
	);
};

ActivityGlobalMessages.propTypes = {
	webappApi: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	setModalVisible: PropTypes.func.isRequired,
};

export default withWebApiAndTranslatorLoader(ActivityGlobalMessages, {
	componentName: 'activity-global-messages',
	logStateOnError: true,
});
