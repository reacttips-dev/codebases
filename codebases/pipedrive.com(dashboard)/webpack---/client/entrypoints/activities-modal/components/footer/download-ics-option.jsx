import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { Option } from '@pipedrive/convention-ui-react';

import modalContext from '../../../../utils/context';

const DownloadIcsOption = ({ activityId, closePopover, translator }) => {
	const downloadIcs = (e) => {
		e && e.preventDefault();

		const url = `/activity/ics/${activityId}`;

		window.open(url, '_self');

		closePopover();
	};

	return <Option onClick={downloadIcs}>{translator.gettext('Download for iCal/Outlook')}</Option>;
};

DownloadIcsOption.propTypes = {
	activityId: PropTypes.number,
	closePopover: PropTypes.func.isRequired,
	translator: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	activityId: state.getIn(['form', 'activityId']),
});

export default connect(mapStateToProps)(modalContext(DownloadIcsOption));
