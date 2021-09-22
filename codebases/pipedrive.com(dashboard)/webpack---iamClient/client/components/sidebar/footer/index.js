import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import style from './style.css';
import lottie from 'lottie-web';

import animationData from './chatWithUs.json';

const defaultOptions = {
	renderer: 'svg',
	loop: true,
	autoplay: false,
	animationData,
};

const stickyFooter = ({
	talkToUs,
	source,
	text,
}) => {
	const animationRef = useRef(null);

	const [animation, setAnimation] = useState(null);

	useEffect(() => {
		setAnimation(lottie.loadAnimation({
			container: animationRef.current,
			...defaultOptions,
		}));
	}, []);

	const onMouseEnter = () => animation && animation.goToAndPlay(0, true);
	const onMouseLeave = () => animation && animation.goToAndStop(0, true);

	return (
		<div
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={() => talkToUs(source)} className={style.footer}>
			<div className={style.container}>
				<div
					className={style.icon}
					ref={animationRef}/>
				<span className={style.footerText}>{text}</span>
			</div>
		</div>
	);
};

stickyFooter.propTypes = {
	talkToUs: PropTypes.func.isRequired,
	source: PropTypes.string,
	text: PropTypes.string,
};

export const Footer = stickyFooter;
export default stickyFooter;
