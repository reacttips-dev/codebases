import ConferenceDropdownOption from './conference-dropdown-option';
import React from 'react';

const ConferenceDropdownOptionsList = ({ conferenceIntegrations, toggleDropdown }) => {
	return conferenceIntegrations.map((conferenceIntegration) => (
		<ConferenceDropdownOption
			key={conferenceIntegration.get('client_id')}
			conferenceIntegration={conferenceIntegration}
			toggleDropdown={toggleDropdown}
		/>
	));
};

export default ConferenceDropdownOptionsList;
