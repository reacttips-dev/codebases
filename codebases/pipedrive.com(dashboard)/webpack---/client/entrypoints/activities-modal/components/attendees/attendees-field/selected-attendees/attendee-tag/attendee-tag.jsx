import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Tag, Tooltip, Icon } from '@pipedrive/convention-ui-react';

import modalContext from '../../../../../../../utils/context';
import { getRSVPIcon } from '../../../../../../../utils/attendees';

const SelectedAttendeeTag = styled(Tag)`
	max-width: 100%;
	overflow: hidden;
`;

const AttendeeTagContent = ({ attendee, error, showStatus, translator }) => {
	const { name, email_address: email, is_organizer: isOrganizer } = attendee;
	const organizerText = `${
		showStatus && isOrganizer ? `(${translator.gettext('organizer')})` : ''
	}`;
	const contentText = `${name ? `${name} (${email})` : email} ${organizerText}`;
	const content = <span className="cui4-tag__content">{contentText}</span>;

	return error ? (
		<Tooltip placement="top" content={error} popperProps={{ positionFixed: true }}>
			{content}
		</Tooltip>
	) : (
		content
	);
};

AttendeeTagContent.propTypes = {
	attendee: PropTypes.object.isRequired,
	showStatus: PropTypes.bool,
	error: PropTypes.string,
	translator: PropTypes.object.isRequired,
};

const AttendeeTag = ({ attendee, removeAttendee, showStatus, translator, error, ...refProps }) => {
	const { popoverRef, onMouseEnter, onMouseLeave } = refProps;
	const { status } = attendee;
	const iconProps = getRSVPIcon(status, translator);

	return (
		<SelectedAttendeeTag
			color={error ? 'red' : null}
			forwardRef={popoverRef}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{showStatus && !attendee.isNew && <Icon size="s" {...iconProps} />}
			<AttendeeTagContent
				translator={translator}
				attendee={attendee}
				error={error}
				showStatus={showStatus}
			/>
			<Tooltip placement="top" content={translator.gettext('Remove')} popperProps={{ positionFixed: true }}>
				<Icon
					icon="cross"
					size="s"
					className="cui4-tag__icon"
					onClick={() => removeAttendee(attendee)}
				/>
			</Tooltip>
		</SelectedAttendeeTag>
	);
};

AttendeeTag.propTypes = {
	attendee: PropTypes.object.isRequired,
	removeAttendee: PropTypes.func.isRequired,
	showStatus: PropTypes.bool,
	error: PropTypes.string,
	translator: PropTypes.object.isRequired,
};

export default modalContext(AttendeeTag);
