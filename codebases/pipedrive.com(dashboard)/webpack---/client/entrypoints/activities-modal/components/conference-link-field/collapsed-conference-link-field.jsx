import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import modalContext from '../../../../utils/context';
import { CollapsedConferenceField } from './conference-link-styles';
import { LinkAlike } from '../form/form-styles';
import CollapsedConferenceFieldCoachmark from './collapsed-conference-field-coachmark';

const CollapsedConferenceMeetingFieldWrapper = ({
	translator,
	handleExpansion,
	integrationInstalled,
}) => {
	const [videoCallCoachmark, setVideoCallCoachmark] = useState();
	const videoCallRef = useRef(null);

	const handleVideoCallClick = () => {
		videoCallCoachmark && videoCallCoachmark.close();
		handleExpansion();
	};

	const CollapsedConferenceMeetingField = (
		<CollapsedConferenceField ref={videoCallRef}>
			<LinkAlike
				onClick={() => handleVideoCallClick()}
				data-test="expand-conference-meeting-field"
			>
				{translator.pgettext('Add guests, location, video call, description', 'video call')}
			</LinkAlike>
			,
		</CollapsedConferenceField>
	);

	if (integrationInstalled === null) {
		return CollapsedConferenceMeetingField;
	}

	return (
		<CollapsedConferenceFieldCoachmark
			integrationInstalled={integrationInstalled}
			fieldRef={videoCallRef}
			setCoachmark={setVideoCallCoachmark}
			handleExpansion={handleExpansion}
		>
			{CollapsedConferenceMeetingField}
		</CollapsedConferenceFieldCoachmark>
	);
};

CollapsedConferenceMeetingFieldWrapper.propTypes = {
	handleExpansion: PropTypes.func.isRequired,
	translator: PropTypes.object.isRequired,
	integrationInstalled: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	integrationInstalled: state.getIn([
		'conferenceMeeting',
		'isConferenceMeetingIntegrationInstalled',
	]),
});

export default connect(mapStateToProps)(modalContext(CollapsedConferenceMeetingFieldWrapper));
