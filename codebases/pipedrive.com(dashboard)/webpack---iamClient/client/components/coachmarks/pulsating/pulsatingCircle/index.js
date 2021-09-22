import React from 'react';
import PropTypes from 'prop-types';
import style from './style.css';

const PulsatingCircle = ({ forwardRef, ...rest }) => (
	<span
		className={style.PulsatingCircle}
		ref={forwardRef}
		{...rest}
	/>
);

PulsatingCircle.propTypes = {
	forwardRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
	rest: PropTypes.object,
};

export default PulsatingCircle;
