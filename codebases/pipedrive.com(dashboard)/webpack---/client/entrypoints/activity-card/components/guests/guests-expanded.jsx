import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { sortAttendees } from '../../../../utils/attendees';
import GuestRow from './guest-row';
import activityCardContext from '../../../../utils/context';
import HoverCard from '../../../../common-components/hover-card';
import { assignAttendeeToPerson } from '../../actions/activity';

const GuestsContainer = styled.div`
	margin-top: 8px;
	width: 100%;
`;

const getHoverCardProps = (guest, assignAttendeeToPerson) => {
	const personId = guest.get('person_id');
	const name = guest.get('name');
	const email = guest.get('email_address');

	if (personId) {
		return {
			hoverCardProps: {
				type: 'person',
				id: personId,
			},
		};
	}

	return {
		addNew: true,
		hoverCardProps: {
			type: 'addNewPerson',
			data: {
				name: name || email,
				email,
			},
			onAddContact: (person) => {
				assignAttendeeToPerson(email, person.id);
			},
		},
	};
};

const GuestsExpanded = (props) => {
	const { guests, webappApi, logger, assignAttendeeToPerson } = props;

	return (
		<GuestsContainer>
			{guests &&
				sortAttendees(guests).map((guest) => (
					<HoverCard
						key={guest.get('email_address')}
						webappApi={webappApi}
						logger={logger}
						source='activity_card'
						popoverProps={{ offset: '-xxl' }}
						{...getHoverCardProps(guest, assignAttendeeToPerson)}
					>
						<GuestRow guest={guest} />
					</HoverCard>
				))}
		</GuestsContainer>
	);
};

GuestsExpanded.propTypes = {
	guests: ImmutablePropTypes.list,
	webappApi: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
	assignAttendeeToPerson: PropTypes.func.isRequired,
};

export default connect(null, { assignAttendeeToPerson })(activityCardContext(GuestsExpanded));
