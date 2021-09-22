import React, { createRef, useEffect, useState } from 'react';
import style from './style.css';
import PropTypes from 'prop-types';
import { Icon } from '@pipedrive/convention-ui-react';
import lottie from 'lottie-web';
import SvgIcon from 'components/svgIcon';

import animationData from './gettingStarted.json';

const defaultOptions = {
	renderer: 'svg',
	loop: false,
	autoplay: true,
	animationData,
};

const Banner = ({ toggleGettingStarted, gettext, display, gettingStartedOpen }) => {
	const func = (e) => toggleGettingStarted ? toggleGettingStarted(e) : null;
	const animationRef = createRef();
	const [showBg, setShowBg] = useState(false);

	useEffect(() => {
		if (!display) {
			setShowBg(true);
		}

		lottie.loadAnimation({
			container: animationRef.current,
			...defaultOptions,
		});
	}, []);

	return (
		<div className={style.bannerWrapper}>
			<div className={style.animation}>
				{showBg ? <SvgIcon classname={'getting-started-icon'} icon="getting-started" /> : <div id="getting-started" ref={animationRef} />}
			</div>
			<div className={style.banner}>
				<span className={style.header}>{gettext('Getting started')}</span>
				<span className={style.subHeader}>{gettext('Set up the tool and learn the basics')}</span>
				<div className={style.link}>
					<a
						href="#"
						onClick={(ev) => {
							gettingStartedOpen();
							func(ev);
						}}
					>
						{gettext('Continue setup')}
					</a>
					<Icon className={style.icon} size={'s'} icon={'arrow-back'} color={'blue'}/>
				</div>
			</div>
		</div>
	);
};

Banner.propTypes = {
	toggleGettingStarted: PropTypes.func.isRequired,
	gettext: PropTypes.func.isRequired,
	display: PropTypes.bool.isRequired,
	gettingStartedOpen: PropTypes.func.isRequired,
};

export default Banner;
