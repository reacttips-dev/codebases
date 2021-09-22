import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from '@pipedrive/convention-ui-react';
import PulsatingCircle from './pulsatingCircle';
import Content from './popoverContent';

import style from './style.css';

function getPlacement(prop) {
	return {
		topRight: 'topRight',
		topLeft: 'topLeft',
	}[prop] || 'topLeft';
}

const PulsatingCoachmark = ({
	content,
	close,
	actions,
	popoverProps,
	zIndex,
	placement,
	onPopupVisible,
	iconUrl,
}) => {
	const zIndexStyle = zIndex ? { zIndex } : {};
	const classes = [style.PulsatingCoachmark, style[`PulsatingCoachmark--${getPlacement(placement)}`]];

	return (
		<div
			className={classes.join(' ')}
			style={zIndexStyle}
		>
			<Popover
				mouseEnterDelay={0}
				style={zIndexStyle}
				trigger="hover"
				onVisibilityChange={(visible) => onPopupVisible(!visible)}
				content={
					<Content
						actions={actions || [{
							label: 'default',
							handler: close,
						}]}
						iconUrl={iconUrl}
						content={content}
					/>
				}
				{...popoverProps}
			>
				<PulsatingCircle style={zIndexStyle} />
			</Popover>
		</div>
	);
};

PulsatingCoachmark.propTypes = {
	close: PropTypes.func.isRequired,
	content: PropTypes.string,
	actions: PropTypes.array,
	zIndex: PropTypes.number,
	placement: PropTypes.string,
	popoverProps: PropTypes.shape({
		offset: Popover.propTypes.offset,
		placement: Popover.propTypes.placement,
	}),
	onPopupVisible: PropTypes.func,
	iconUrl: PropTypes.string,
};

PulsatingCoachmark.defaultProps = {
	placement: 'topLeft',
};

export default PulsatingCoachmark;
