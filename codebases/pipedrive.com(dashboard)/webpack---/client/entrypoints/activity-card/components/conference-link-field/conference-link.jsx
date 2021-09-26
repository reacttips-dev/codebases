import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
	joinConferenceMeetingUrl,
	copyConferenceMeetingUrl,
} from '../../actions/conference-meeting';
import CopyButton from '../../../../common-components/conference-link-field/CopyButton';
import JoinMeetingButton from '../../../../common-components/conference-link-field/JoinMeetingButton';

const ConferenceLinkWrapper = styled.div`
	display: flex;
	align-items: center;
`;

const ConferenceLink = ({ link, trackJoin, trackCopy, conferenceMeeting }) => {
	const joinTitle = conferenceMeeting.get('join_title');

	return (
		<ConferenceLinkWrapper>
			<JoinMeetingButton
				link={link}
				onClick={() => trackJoin(conferenceMeeting)}
				joinTitle={joinTitle}
				fromActivityCard={true}
			/>
			<CopyButton copyText={link} onClick={() => trackCopy(conferenceMeeting)} />
		</ConferenceLinkWrapper>
	);
};

ConferenceLink.propTypes = {
	link: PropTypes.string.isRequired,
	trackJoin: PropTypes.func.isRequired,
	trackCopy: PropTypes.func.isRequired,
	conferenceMeeting: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	return {
		conferenceMeeting: state.getIn(['conferenceMeeting', 'integration']),
	};
};

export default connect(mapStateToProps, {
	trackJoin: joinConferenceMeetingUrl,
	trackCopy: copyConferenceMeetingUrl,
})(ConferenceLink);
