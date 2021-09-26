import React, { useState } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { trackInteraction as trackInteractionAction } from '../../actions/activity';
import GuestsHeader from './guests-header';
import GuestsExpanded from './guests-expanded';

const ExpandableContent = styled.div``;

const Guests = (props) => {
	const { guests, updateActivityCardPlacement, trackInteraction } = props;
	const [expanded, setExpanded] = useState(false);

	if (!guests || !guests.size) {
		return null;
	}

	const toggleExpand = () => {
		setExpanded(!expanded);
		updateActivityCardPlacement();
		trackInteraction(expanded ? 'guests_collapsed' : 'guests_expanded');
	};

	return (
		<ExpandableContent>
			<GuestsHeader guests={guests} expanded={expanded} onClick={toggleExpand} />
			{expanded && <GuestsExpanded guests={guests} />}
		</ExpandableContent>
	);
};

Guests.propTypes = {
	updateActivityCardPlacement: PropTypes.func.isRequired,
	guests: ImmutablePropTypes.list,
	trackInteraction: PropTypes.func.isRequired,
};

export default connect(null, { trackInteraction: trackInteractionAction })(Guests);
