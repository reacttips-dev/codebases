import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DropdownOption, DropdownRedirectIcon, DropdownAppName } from './conference-link-styles';
import { createConferenceMeetingUrl as createConferenceMeetingUrlAction } from '../../store/actions/conference-meeting';
import { clickOnInstallIntegrationLink as clickOnInstallIntegrationLinkAction } from '../../store/actions/modal';
import modalContext from '../../../../utils/context';
import DropdownIcon from './DropdownIcon';

const ConferenceDropdownOption = ({
	conferenceIntegration,
	translator,
	createConferenceMeetingUrl,
	toggleDropdown,
	clickOnInstallIntegrationLink,
}) => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const {
		is_installed: isInstalled,
		icon,
		marketplace_url: marketplaceUrl,
		dropdown_label: dropdownLabel,
	} = conferenceIntegration.toJS();

	const onDropdownOptionClick = () => {
		toggleDropdown();

		if (isInstalled) {
			createConferenceMeetingUrl(conferenceIntegration);
		} else {
			clickOnInstallIntegrationLink(conferenceIntegration);
		}
	};

	return (
		<DropdownOption
			href={!isInstalled ? marketplaceUrl : undefined}
			target={!isInstalled ? '_blank' : undefined}
			onClick={onDropdownOptionClick}
		>
			{icon && (
				<DropdownIcon
					onIconLoad={() => setImageLoaded(true)}
					iconLoaded={imageLoaded}
					src={icon}
					spacing={{ right: 's' }}
					translator={translator}
				/>
			)}
			<DropdownAppName>{dropdownLabel}</DropdownAppName>
			{!isInstalled && <DropdownRedirectIcon icon="redirect" color="white" size="s" />}
		</DropdownOption>
	);
};

ConferenceDropdownOption.propTypes = {
	conferenceIntegration: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	createConferenceMeetingUrl: PropTypes.func.isRequired,
	toggleDropdown: PropTypes.func,
	clickOnInstallIntegrationLink: PropTypes.func,
};

const mapDispatchToProps = {
	createConferenceMeetingUrl: createConferenceMeetingUrlAction,
	clickOnInstallIntegrationLink: clickOnInstallIntegrationLinkAction,
};

export default connect(null, mapDispatchToProps)(modalContext(ConferenceDropdownOption));
