import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import lottie from 'lottie-web';
import animationData from '../SetupPipedrive.json';

import style from '../style.css';

const defaultOptions = {
	renderer: 'svg',
	loop: true,
	autoplay: true,
	animationData,
};

const DefaultView = ({ gettext }) => {
	const animationRef = useRef(null);

	useEffect(() => {
		lottie.loadAnimation({
			container: animationRef.current,
			...defaultOptions,
		});
	}, []);

	return (<div className={style.wrapper}>
		<div className={style.icon}
			ref={animationRef}/>
		<div className={style.title}>
			{gettext('Set up Pipedrive')}
		</div>
		<div className={style.subTitle}>
			{gettext('Discover the full potential of the app.')}
		</div>
	</div>);
};

DefaultView.propTypes = {
	gettext: PropTypes.func.isRequired,
};

export default DefaultView;