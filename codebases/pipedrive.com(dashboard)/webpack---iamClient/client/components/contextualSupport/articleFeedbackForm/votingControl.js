import React from 'react';
import PropTypes from 'prop-types';
import VoteButton from './voteButton';

import style from './style.css';

const VOTE_POSITIVE = 1;
const VOTE_NEGATIVE = -1;

const votingControl = ({
	activeVote,
	onVoteButtonClick,
}) => (
	<div className={style.VotingControl}>
		<VoteButton icon='thumb-up' isActive={activeVote === VOTE_POSITIVE} onClick={() => onVoteButtonClick(VOTE_POSITIVE)}/>
		<VoteButton icon='thumb-down' isActive={activeVote === VOTE_NEGATIVE} onClick={() => onVoteButtonClick(VOTE_NEGATIVE)}/>
	</div>
);

votingControl.propTypes = {
	activeVote: PropTypes.number,
	onVoteButtonClick: PropTypes.func.isRequired,
};

export default votingControl;