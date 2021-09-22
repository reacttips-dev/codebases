import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as Immutable from 'immutable';

import { Button, Checkbox } from '@pipedrive/convention-ui-react';

import { updateField } from '../../store/actions/form';
import { saveActivity as saveActivityAction } from '../../store/actions/request-state';

import { getActivityOrganizerDetails } from '../../../../utils/activity';
import modalContext from '../../../../utils/context';
import colors from '../../colors.scss';
import FooterAdditionalActions from './footer-additional-actions';

const FooterWrapper = styled.div`
	display: flex;
	flex-shrink: 0;
	justify-content: space-between;
	align-items: center;
	background: ${colors.footerBackground};
	border-top: 1px solid ${colors.borderColor};
	height: 48px;
	margin-top: auto;
	box-sizing: border-box;
	padding: 0 16px;
	overflow: hidden;
`;

const FooterLeft = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-right: 16px;
`;
const FooterRight = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	overflow: hidden;
`;

const CancelButton = styled(Button)`
	margin-left: 16px;
`;

const SaveButton = styled(Button)`
	margin-left: 8px;
`;

const MarkAsDone = styled(Checkbox)`
	flex: 1;
	min-width: 100px;

	.cui4-checkbox__label {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;

const getSaveButtonText = ({
	sendNotifications,
	activityId,
	hasAttendees,
	shouldSendUpdatesToAttendees,
	translator,
	createdFromCalendarSync,
	hasActiveCalendarSync,
	isCurrentUserActivityOrganizer,
}) => {
	if (sendNotifications) {
		return translator.gettext('Save and send invites');
	}

	if ((!hasActiveCalendarSync && createdFromCalendarSync) || !isCurrentUserActivityOrganizer) {
		return translator.gettext('Save');
	}

	if (hasAttendees) {
		const updateActivityButtonText = shouldSendUpdatesToAttendees
			? translator.gettext('Save and send updates')
			: translator.gettext('Save');
		const newActivityButtonText = translator.gettext('Save and send invites');

		return activityId > 0 ? updateActivityButtonText : newActivityButtonText;
	}

	if (shouldSendUpdatesToAttendees) {
		return translator.gettext('Save and send updates');
	}

	return translator.gettext('Save');
};

const Footer = (props) => {
	const {
		saveActivity,
		onClose,
		onSave,
		showAdditionalActions,
		sendNotifications,
		hasParticipantWithoutEmail,
		activityDone,
		setDoneValue,
		hasErrors,
		noParticipants,
		activityId,
		hasAttendees,
		shouldSendUpdatesToAttendees,
		translator,
		conferenceMeetingUrlInProgress,
		createdFromCalendarSync,
		hasActiveCalendarSync,
		isCurrentUserActivityOrganizer,
		isContextualView,
	} = props;

	const cantSendToParticipants =
		sendNotifications && (noParticipants || hasParticipantWithoutEmail);
	const cannotSave = hasErrors || cantSendToParticipants || conferenceMeetingUrlInProgress;
	const saveButtonText = getSaveButtonText({
		sendNotifications,
		activityId,
		hasAttendees,
		shouldSendUpdatesToAttendees,
		translator,
		createdFromCalendarSync,
		hasActiveCalendarSync,
		isCurrentUserActivityOrganizer,
	});

	return (
		<FooterWrapper>
			<FooterLeft>
				{showAdditionalActions && <FooterAdditionalActions onClose={onClose} />}
			</FooterLeft>
			<FooterRight>
				<MarkAsDone
					checked={activityDone}
					onChange={() => setDoneValue(!activityDone)}
					data-test="mark-as-done"
				>
					{translator.gettext('Mark as done')}
				</MarkAsDone>
				<CancelButton data-test="cancel-activity-button" onClick={() => onClose()}>
					{translator.gettext('Cancel')}
				</CancelButton>
				<SaveButton
					data-test="save-activity-button"
					data-coachmark="save-activity-button"
					color="green"
					disabled={cannotSave}
					onClick={() => {
						saveActivity(onClose, isContextualView);
						onSave && onSave();
					}}
				>
					{saveButtonText}
				</SaveButton>
			</FooterRight>
		</FooterWrapper>
	);
};

Footer.propTypes = {
	activityId: PropTypes.number,
	saveActivity: PropTypes.func,
	activityDone: PropTypes.bool,
	onClose: PropTypes.func,
	onSave: PropTypes.func,
	showAdditionalActions: PropTypes.bool,
	translator: PropTypes.object.isRequired,
	setDoneValue: PropTypes.func.isRequired,
	sendNotifications: PropTypes.bool,
	hasParticipantWithoutEmail: PropTypes.bool,
	noParticipants: PropTypes.bool,
	hasErrors: PropTypes.bool,
	hasAttendees: PropTypes.bool,
	shouldSendUpdatesToAttendees: PropTypes.bool,
	conferenceMeetingUrlInProgress: PropTypes.bool,
	createdFromCalendarSync: PropTypes.bool,
	hasActiveCalendarSync: PropTypes.bool,
	isCurrentUserActivityOrganizer: PropTypes.bool,
	isContextualView: PropTypes.bool,
};

const mapStateToProps = (state) => {
	const attendees = state.getIn(['form', 'attendees'], new Immutable.List());
	const userId = state.getIn(['form', 'userId']);
	const { isCurrentUserActivityOrganizer } = getActivityOrganizerDetails(attendees, userId);

	return {
		activityId: state.getIn(['form', 'activityId']),
		activityDone: state.getIn(['form', 'done']),
		sendNotifications: state.getIn(['form', 'sendActivityNotifications']),
		hasParticipantWithoutEmail: state.getIn(['notifications', 'hasParticipantWithoutEmail']),
		noParticipants: state.getIn(['form', 'participants']).isEmpty(),
		hasErrors: !state.getIn(['form', 'errors'], new Immutable.Set()).isEmpty(),
		hasAttendees: !attendees.isEmpty(),
		shouldSendUpdatesToAttendees: state.getIn(['form', 'shouldSendUpdatesToAttendees'], false),
		conferenceMeetingUrlInProgress: state.getIn([
			'conferenceMeeting',
			'conferenceMeetingUrlInProgress',
		]),
		createdFromCalendarSync: state.getIn(['form', 'referenceType']) === 'calendar-sync',
		hasActiveCalendarSync: state.getIn(['modal', 'hasActiveCalendarSync']),
		isCurrentUserActivityOrganizer,
	};
};

const mapDispatchToProps = (dispatch) => ({
	saveActivity: (doClose, isContextualView) =>
		dispatch(saveActivityAction(doClose, isContextualView)),
	setDoneValue: (done) => dispatch(updateField('done', done)),
});

export default connect(mapStateToProps, mapDispatchToProps)(modalContext(Footer));
