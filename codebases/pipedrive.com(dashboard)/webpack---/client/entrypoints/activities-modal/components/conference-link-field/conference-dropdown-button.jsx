import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button, Icon } from '@pipedrive/convention-ui-react';
import modalContext from '../../../../utils/context';
import { createConferenceMeetingUrl as createConferenceMeetingUrlAction } from '../../store/actions/conference-meeting';
import { separateConferenceIntegrationsByInstall } from '../../../../utils/conference-meeting-integration';
import InstallIntegrationButton from './install-integration-button';
import CreateMeetingButton from './create-meeting-button';

const ConferenceDropdownButton = ({
	translator,
	conferenceMeetingIntegrations,
	createConferenceMeetingUrl,
	toggleDropdown,
	popoverVisible,
}) => {
	const integrationsSeparatedByInstall = separateConferenceIntegrationsByInstall(
		conferenceMeetingIntegrations,
	);
	const installedIntegrations = integrationsSeparatedByInstall.get('installedIntegrations');
	const notInstalledIntegrations = integrationsSeparatedByInstall.get('notInstalledIntegrations');

	const noIntegrationsInstalled = installedIntegrations.size === 0;
	const singleIntegrationInstalled = installedIntegrations.size === 1;
	const multipleIntegrationsInstalled = installedIntegrations.size > 1;

	let lastUsedIntegration;

	if (multipleIntegrationsInstalled) {
		lastUsedIntegration = installedIntegrations.find((integration) =>
			integration.get('last_used'),
		);
	}

	const noInstallableIntegrationsAvailable = notInstalledIntegrations.size === 0;
	const oneInstallableIntegrationAvailable = notInstalledIntegrations.size === 1;

	const isDropdownAvailable = !(singleIntegrationInstalled && noInstallableIntegrationsAvailable);

	if (noIntegrationsInstalled) {
		if (oneInstallableIntegrationAvailable) {
			return <InstallIntegrationButton integration={notInstalledIntegrations.get(0)} />;
		}

		return (
			<Button onClick={toggleDropdown}>
				{translator.gettext('Install video call integration')}
				<Icon icon="triangle-down" />
			</Button>
		);
	}

	const defaultIntegration = lastUsedIntegration
		? lastUsedIntegration
		: installedIntegrations.get(0);

	return (
		<CreateMeetingButton
			integration={defaultIntegration}
			dropdownActive={popoverVisible}
			dropdownAvailable={isDropdownAvailable}
			onDropdownToggle={toggleDropdown}
			onClick={() => createConferenceMeetingUrl(defaultIntegration)}
		/>
	);
};

ConferenceDropdownButton.propTypes = {
	translator: PropTypes.object.isRequired,
	conferenceMeetingIntegrations: ImmutablePropTypes.list,
	createConferenceMeetingUrl: PropTypes.func,
	toggleDropdown: PropTypes.func,
	popoverVisible: PropTypes.bool,
};

const mapStateToProps = (state) => {
	return {
		conferenceMeetingIntegrations: state.getIn([
			'conferenceMeeting',
			'conferenceMeetingIntegrations',
		]),
	};
};

const mapDispatchToProps = {
	createConferenceMeetingUrl: createConferenceMeetingUrlAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(modalContext(ConferenceDropdownButton));
