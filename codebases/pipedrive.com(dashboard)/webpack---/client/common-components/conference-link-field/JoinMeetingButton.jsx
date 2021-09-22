import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip, Button } from '@pipedrive/convention-ui-react';
import withContext from '../../utils/context';

const JoinButton = styled(Button)`
	margin-right: 8px;
`;

const JoinMeetingButton = ({ translator, link, onClick, joinTitle, fromActivityCard }) => {
	return (
		<Tooltip
			placement="top"
			popperProps={{ positionFixed: true }}
			content={translator.gettext('Join video call')}
		>
			<JoinButton
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				onClick={onClick}
				data-test="conference-meeting-link"
				color={fromActivityCard ? 'green' : null}
			>
				{joinTitle || translator.gettext('Join Meeting')}
			</JoinButton>
		</Tooltip>
	);
};

JoinMeetingButton.propTypes = {
	translator: PropTypes.object.isRequired,
	link: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	joinTitle: PropTypes.string.isRequired,
	fromActivityCard: PropTypes.bool,
};

export default withContext(JoinMeetingButton);
