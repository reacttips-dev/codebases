import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@pipedrive/convention-ui-react';

import style from './style.css';

function voteButton({
	icon,
	isActive,
	onClick,
}) {
	const className = classNames({
		[style.VotingControl__voteButton]: true,
		[style['VotingControl__voteButton--active']]: isActive,
	});

	return (
		<button className={className} onClick={onClick}>
			<Icon icon={icon} color={isActive ? 'blue' : 'black-64'}/>
		</button>
	);
}

voteButton.propTypes = {
	icon: PropTypes.string.isRequired,
	isActive: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
};

export default voteButton;