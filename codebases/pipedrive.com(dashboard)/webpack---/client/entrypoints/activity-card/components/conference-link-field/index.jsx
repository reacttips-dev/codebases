import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import activityCardContext from '../../../../utils/context';
import CardRow from '../card-row';
import ConferenceLink from './conference-link';

const ConferenceLinkField = ({ translator, integrationInstalled, conferenceMeetingUrl }) => {
	if (!integrationInstalled || !conferenceMeetingUrl) {
		return null;
	}

	return (
		<CardRow
			icon="videocam"
			title={translator.gettext('Conference meeting')}
			data-test="activity-card-conference-meeting"
			centerIcon
		>
			<ConferenceLink link={conferenceMeetingUrl} />
		</CardRow>
	);
};

ConferenceLinkField.propTypes = {
	translator: PropTypes.object.isRequired,
	integrationInstalled: PropTypes.bool,
	conferenceMeetingUrl: PropTypes.string,
};

const mapStateToProps = (state) => ({
	integrationInstalled: state.getIn(['activity', 'isConferenceMeetingIntegrationInstalled']),
	conferenceMeetingUrl: state.getIn(['activity', 'conferenceMeetingUrl']),
});

export default connect(mapStateToProps)(activityCardContext(ConferenceLinkField));
