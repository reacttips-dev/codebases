import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip, Icon } from '@pipedrive/convention-ui-react';
import modalContext from '../../../../utils/context';
import {
	joinConferenceMeetingUrl,
	copyConferenceMeetingUrl,
	deleteConferenceMeetingUrl,
} from '../../store/actions/modal';
import JoinMeetingButton from '../../../../common-components/conference-link-field/JoinMeetingButton';
import CopyButton from '../../../../common-components/conference-link-field/CopyButton';
import { ConferenceField, MeetingActionButtons, DeleteButton } from './conference-link-styles';
import { setActiveConferenceMeeting as setActiveConferenceMeetingAction } from '../../store/actions/conference-meeting';

const ConferenceLink = ({
	translator,
	link,
	onDelete,
	trackJoin,
	trackCopy,
	trackDelete,
	conferenceMeeting,
	setActiveConferenceMeeting,
}) => {
	useEffect(() => {
		setActiveConferenceMeeting();
	}, []);

	const joinTitle = conferenceMeeting.get('joinTitle');
	const integration = conferenceMeeting.get('activeConferenceMeetingIntegration');
	const deleteConferenceLink = () => {
		onDelete();
		trackDelete(integration);
	};

	return (
		<ConferenceField>
			<JoinMeetingButton
				link={link}
				onClick={() => trackJoin(integration)}
				joinTitle={joinTitle}
			/>

			<MeetingActionButtons>
				<CopyButton
					copyText={link}
					tooltip={translator.gettext('Copy meeting information')}
					successMessage={translator.gettext('Meeting information copied!')}
					onClick={() => trackCopy(integration)}
				/>
				<Tooltip
					placement="top"
					popperProps={{ positionFixed: true }}
					content={translator.gettext('Remove invitation')}
				>
					<DeleteButton
						onClick={deleteConferenceLink}
						data-test="delete-conference-link-button"
					>
						<Icon icon="trash" size="s" />
					</DeleteButton>
				</Tooltip>
			</MeetingActionButtons>
		</ConferenceField>
	);
};

ConferenceLink.propTypes = {
	translator: PropTypes.object.isRequired,
	link: PropTypes.string.isRequired,
	onDelete: PropTypes.func.isRequired,
	trackJoin: PropTypes.func.isRequired,
	trackCopy: PropTypes.func.isRequired,
	trackDelete: PropTypes.func.isRequired,
	conferenceMeeting: PropTypes.object,
	setActiveConferenceMeeting: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	conferenceMeeting: state.get('conferenceMeeting'),
});

export default connect(mapStateToProps, {
	trackJoin: joinConferenceMeetingUrl,
	trackCopy: copyConferenceMeetingUrl,
	trackDelete: deleteConferenceMeetingUrl,
	setActiveConferenceMeeting: setActiveConferenceMeetingAction,
})(modalContext(ConferenceLink));
