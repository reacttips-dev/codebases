import React from 'react';
import PropTypes  from 'prop-types';
import { Icon } from '@pipedrive/convention-ui-react';
import translate from 'containers/translation';
import track from 'containers/tracking';
import { gettingStartedItemClicked } from 'actions/gettingStarted';

import style from './style.css';

function videoSummary({
	url,
	title,
	subtitle,
	expand,
}) {
	return (
		<div className={style.VideoSummary} onClick={() => {
			expand({
				tagName: 'IFRAME',
				height: '365',
				width: '650',
				src: url,
			});
		}}>
			<Icon className={style.VideoSummary__icon} icon={'play-video'} color={'blue-tint'}/>
			<div className={style.VideoSummary__title}>{title}</div>
			<div className={style.VideoSummary__subtitle}>{subtitle}</div>
		</div>
	);
}

videoSummary.propTypes = {
	url: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	expand: PropTypes.func.isRequired,
};

export const VideoSummary = videoSummary;
export default track(gettingStartedItemClicked)(translate()(VideoSummary));

