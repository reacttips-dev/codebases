import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Icon, Spacing } from '@pipedrive/convention-ui-react';
import DropdownIcon from './DropdownIcon';
import modalContext from '../../../../utils/context';
import useCoachmarkEffect, {
	getConferenceMeetingCoachmarkOptions,
} from '../../../../utils/use-coachmark-effect';

const CreateMeetingButton = ({
	integration,
	translator,
	onClick,
	onDropdownToggle,
	dropdownActive,
	dropdownAvailable,
	webappApi,
}) => {
	const [createConferenceLinkCoachmark, setCreateConferenceLinkCoachmark] = useState();
	const conferenceLinkRef = useRef(null);

	const isZoomApp = integration.get('short_name') === 'Zoom';

	useCoachmarkEffect({
		webappApi,
		elRef: conferenceLinkRef,
		setCoachmark: setCreateConferenceLinkCoachmark,
		options: getConferenceMeetingCoachmarkOptions({
			integrationInstalled: true,
			detached: true,
			translator,
		}),
	});

	const handleClick = () => {
		if (isZoomApp) {
			createConferenceLinkCoachmark && createConferenceLinkCoachmark.close();
		}

		onClick();
	};

	return (
		<ButtonGroup>
			<Button
				onClick={handleClick}
				data-test="create-conference-link"
				forwardRef={isZoomApp ? conferenceLinkRef : null}
			>
				{integration.get('icon') ? (
					<DropdownIcon
						src={integration.get('icon')}
						spacing={{ horizontal: 'xs' }}
						translator={translator}
					/>
				) : null}
				<Spacing right="xs" left="xs">{integration.get('title')}</Spacing>
			</Button>
			{dropdownAvailable && (
				<Button onClick={onDropdownToggle} active={dropdownActive}>
					<Icon icon="triangle-down" />
				</Button>
			)}
		</ButtonGroup>
	);
};

CreateMeetingButton.propTypes = {
	integration: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
	onDropdownToggle: PropTypes.func.isRequired,
	dropdownActive: PropTypes.bool.isRequired,
	dropdownAvailable: PropTypes.bool.isRequired,
	webappApi: PropTypes.object.isRequired,
};

export default modalContext(CreateMeetingButton);
