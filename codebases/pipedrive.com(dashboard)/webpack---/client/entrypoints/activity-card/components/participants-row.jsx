import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import activityCardContext from '../../../utils/context';
import HoverCard from '../../../common-components/hover-card';
import { LinkToItem } from './link-card-row';

const ParticipantsRow = ({ participants, translator, webappApi, logger }) => {
	if (!participants || participants.isEmpty()) {
		return null;
	}

	return participants.map((participant) => (
		<HoverCard
			key={`participant-${participant.get('person_id')}`}
			webappApi={webappApi}
			logger={logger}
			source='activity_card'
			hoverCardProps={{ type: 'person', id: participant.get('person_id') }}
		>
			<LinkToItem url={`/person/${participant.get('person_id')}`}>
				{participant.get('name') || `(${translator.gettext('hidden')})`}
			</LinkToItem>
		</HoverCard>
	));
};

ParticipantsRow.propTypes = {
	participants: ImmutablePropTypes.list,
	translator: PropTypes.object.isRequired,
	webappApi: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
};

export default activityCardContext(ParticipantsRow);
