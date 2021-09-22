import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@pipedrive/convention-ui-react';
import { DropdownRedirectIcon } from './conference-link-styles';
import { connect } from 'react-redux';
import { clickOnInstallIntegrationLink } from '../../store/actions/modal';
import modalContext from '../../../../utils/context';
import useCoachmarkEffect, {
	getConferenceMeetingCoachmarkOptions,
} from '../../../../utils/use-coachmark-effect';

const InstallIntegrationButton = ({ integration, trackClick, translator, webappApi }) => {
	const [installIntegrationCoachmark, setInstallIntegrationCoachmark] = useState();
	const conferenceLinkRef = useRef(null);

	const isZoomApp = integration.get('short_name') === 'Zoom';

	useCoachmarkEffect({
		webappApi,
		elRef: conferenceLinkRef,
		setCoachmark: setInstallIntegrationCoachmark,
		options: getConferenceMeetingCoachmarkOptions({
			integrationInstalled: false,
			detached: true,
			translator,
		}),
	});

	const closeCoachmark = () => {
		if (isZoomApp) {
			installIntegrationCoachmark && installIntegrationCoachmark.close();
			trackClick(integration);
		}
	};

	return (
		<Button
			forwardRef={isZoomApp ? conferenceLinkRef : null}
			href={integration.get('marketplace_url')}
			target="_blank"
			onClick={closeCoachmark}
		>
			{integration.get('install_title')}
			<DropdownRedirectIcon icon="redirect" size="s" />
		</Button>
	);
};

InstallIntegrationButton.propTypes = {
	integration: PropTypes.object.isRequired,
	trackClick: PropTypes.func,
	translator: PropTypes.object.isRequired,
	webappApi: PropTypes.object.isRequired,
};

export default connect(null, { trackClick: clickOnInstallIntegrationLink })(
	modalContext(InstallIntegrationButton),
);
