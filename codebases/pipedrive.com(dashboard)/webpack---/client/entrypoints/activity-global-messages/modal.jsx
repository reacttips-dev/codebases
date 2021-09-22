import React, { useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, Text, Icon } from '@pipedrive/convention-ui-react';

import { Dialog, CloseButton, Container, Subtitle, Title, Explanation } from './components';
import { getMessage, reauthSettingName } from './helpers';
import {
	trackCalendarSyncReauthWarningClicked,
	trackCalendarSyncReauthWarningSeen,
} from './tracking';
import calendarImage from './calendar_reauth.png';

const CalendarReauthModal = ({ translator, webappApi, visible, setVisible }) => {
	const onClose = async (routeToSettings) => {
		setVisible(false);

		webappApi.userSelf.settings.save({
			[reauthSettingName]: 'awaiting_reauth',
		});

		if (routeToSettings) {
			webappApi.router.navigateTo('/settings/calendar-sync');
			trackCalendarSyncReauthWarningClicked(webappApi);
		}
	};

	useEffect(() => {
		trackCalendarSyncReauthWarningSeen(webappApi);
	}, []);

	return (
		<Dialog
			visible={visible}
			actions={
				<Button color="green" onClick={() => onClose(true)}>
					{translator.gettext('Re-authenticate now')}
				</Button>
			}
		>
			<Container>
				<CloseButton onClick={() => onClose(false)}>
					<Icon icon="cross" color="black-64" />
				</CloseButton>
				<img src={calendarImage} alt="calendar" />
				<Title>{translator.gettext('Re-authentication needed')}</Title>
				<Subtitle>
					{translator.gettext(
						'Re-authenticate as soon as possible to avoid calendar sync disruptions.',
					)}
				</Subtitle>
				<Explanation>
					<Text>{getMessage('reauth', translator)}</Text>
					<Text>
						{translator.gettext(
							`We are migrating the calendar sync integration from the third-party
								Nylas to our own, more reliable and stable in-house solution by %s.`,
							[moment(new Date('07/19/2021')).format('Do MMMM YYYY')],
						)}
					</Text>
				</Explanation>
			</Container>
		</Dialog>
	);
};

CalendarReauthModal.propTypes = {
	translator: {
		gettext: PropTypes.func.isRequired,
	},
	webappApi: {
		userSelf: {
			settings: {
				get: PropTypes.func.isRequired,
				save: PropTypes.func.isRequired,
			},
		},
	},
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
};

export default CalendarReauthModal;
