import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';
import { Avatar, Icon, Tooltip } from '@pipedrive/convention-ui-react';

import { getRSVPIcon } from '../../../../utils/attendees';
import activityCardContext from '../../../../utils/context';
import css from '../lib/variables.scss';

const RowWrapper = styled.div`
	display: flex;
	flex-direction: row;
	height: 36px;
	padding-bottom: 4px;
	align-items: center;
`;
const GuestInfo = styled.div`
	margin-left: 8px;
`;
const ExtraInfo = styled.div`
	color: ${css.guestCountColor};
	font-size: ${css.fontSizeSmall};
`;
const AvatarWrapper = styled.div`
	position: relative;
	margin-right: 8px;
`;

const TinyStatusIcon = styled(Icon)`
	position: absolute;
	width: 16px;
	height: 16px;
	padding: 0;
	right: -8px;
	bottom: -4px;
	border-radius: 50%;
	border: 1px solid #fff;
	background-color: #fff;
`;

const StatusIcon = (props) => {
	const { status, translator } = props;
	const { icon, color, title } = getRSVPIcon(status, translator);

	return (
		<Tooltip mouseEnterDelay={0.5} placement="top" content={title}>
			<TinyStatusIcon icon={icon} color={color} size="s" />
		</Tooltip>
	);
};

StatusIcon.propTypes = {
	status: PropTypes.string,
	translator: PropTypes.object.isRequired,
};

const GuestInfoContent = (props) => {
	const { name, emailAddress, extraInfo } = props;

	return (
		<>
			{name || emailAddress}
			{extraInfo && <ExtraInfo>{extraInfo}</ExtraInfo>}
		</>
	);
};

GuestInfoContent.propTypes = {
	name: PropTypes.string,
	emailAddress: PropTypes.string,
	extraInfo: PropTypes.string,
};

const GuestRow = (props) => {
	const { guest, translator, hasActiveCalendarSync } = props;
	const name = guest.get('name');
	const emailAddress = guest.get('email_address');

	let extraInfo = null;

	if (guest.get('is_organizer')) {
		extraInfo = translator.gettext('Organizer');
	}

	const contentProps = { name, emailAddress, extraInfo };

	return (
		<RowWrapper>
			<AvatarWrapper>
				<Avatar name={name} size="s" />
				{ hasActiveCalendarSync && <StatusIcon translator={translator} status={guest.get('status')} /> }
			</AvatarWrapper>
			<GuestInfo>
				<GuestInfoContent {...contentProps} />
			</GuestInfo>
		</RowWrapper>
	);
};

GuestRow.propTypes = {
	guest: ImmutablePropTypes.map,
	translator: PropTypes.object.isRequired,
	hasActiveCalendarSync: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	hasActiveCalendarSync: state.getIn(['activity', 'hasActiveCalendarSync']),
});

export default connect(mapStateToProps)(activityCardContext(GuestRow));
