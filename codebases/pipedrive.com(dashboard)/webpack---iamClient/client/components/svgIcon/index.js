import React from 'react';
import PropTypes from 'prop-types';

import CalendarSync from './icons/calendar_sync.svg';
import ContactSync from './icons/contact_sync.svg';
import EmailSync from './icons/email_sync.svg';
import ImportDataBlue from './icons/import_data_blue.svg';
import InviteTeamGreen from './icons/invite_team_green.svg';
import GettingStarted from './icons/getting_started.svg';
import EmailSyncYellow from './icons/email_sync_yellow.svg';

export const iconsKeys = [
	'calendar-sync',
	'contact-sync',
	'email-sync',
	'import-data-blue',
	'invite-team-green',
	'getting-started',
	'email-sync-yellow',
];

const icons = {
	'calendar-sync': CalendarSync,
	'contact-sync': ContactSync,
	'email-sync': EmailSync,
	'email-sync-yellow': EmailSyncYellow,
	'import-data-blue': ImportDataBlue,
	'invite-team-green': InviteTeamGreen,
	'getting-started': GettingStarted,
};

const SvgIcon = ({ icon, classname }) => {
	return (
		<img className={classname} src={icons[icon]} />
	);
};

SvgIcon.propTypes = {
	classname: PropTypes.string,
	icon: PropTypes.oneOf(iconsKeys).isRequired,
};

export default SvgIcon;