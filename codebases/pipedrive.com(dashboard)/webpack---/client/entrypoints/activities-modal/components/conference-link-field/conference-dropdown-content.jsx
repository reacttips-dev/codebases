import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { DropdownContentDiv, DropdownIntegrationSeparator } from './conference-link-styles';
import modalContext from '../../../../utils/context';
import { separateConferenceIntegrationsByInstall } from '../../../../utils/conference-meeting-integration';
import ConferenceDropdownOptionsList from './conference-dropdown-options-list';
import { List } from 'immutable';

const ConferenceDropdownContent = ({
	translator,
	conferenceMeetingIntegrations,
	toggleDropdown,
}) => {
	const integrationsSeparatedByInstall = separateConferenceIntegrationsByInstall(
		conferenceMeetingIntegrations,
	);
	const installedIntegrations = integrationsSeparatedByInstall.get('installedIntegrations');
	const notInstalledIntegrations = integrationsSeparatedByInstall.get('notInstalledIntegrations');

	const hasInstalledAndUninstalledIntegrations =
		installedIntegrations.size > 0 && notInstalledIntegrations.size > 0;
	const hasMultipleIntegrationsInstalled = installedIntegrations.size > 1;
	const hasUninstalledIntegrations = notInstalledIntegrations.size > 0;

	const integrationsToList = installedIntegrations.reduceRight((accum, current, index) => {
		// Because either the last used or first installed integration will be rendered
		// on the button, we want to remove it from the dropdown
		if (
			current.get('last_used') ||
			(index === 0 && installedIntegrations.size === accum.size + 1)
		) {
			return accum;
		}

		return accum.push(current);
	}, new List());

	return (
		<DropdownContentDiv>
			{hasMultipleIntegrationsInstalled && (
				<ConferenceDropdownOptionsList
					conferenceIntegrations={integrationsToList}
					toggleDropdown={toggleDropdown}
				/>
			)}

			{hasInstalledAndUninstalledIntegrations && (
				<DropdownIntegrationSeparator type="block">
					{translator.gettext('Install integrations')}
				</DropdownIntegrationSeparator>
			)}

			{hasUninstalledIntegrations && (
				<ConferenceDropdownOptionsList
					toggleDropdown={toggleDropdown}
					conferenceIntegrations={notInstalledIntegrations}
				/>
			)}
		</DropdownContentDiv>
	);
};

ConferenceDropdownContent.propTypes = {
	translator: PropTypes.object.isRequired,
	conferenceMeetingIntegrations: ImmutablePropTypes.list,
	toggleDropdown: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	return {
		conferenceMeetingIntegrations: state.getIn([
			'conferenceMeeting',
			'conferenceMeetingIntegrations',
		]),
	};
};

export default connect(mapStateToProps, null)(modalContext(ConferenceDropdownContent));
