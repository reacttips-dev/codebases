import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ImageOverlay } from '@pipedrive/convention-ui-react';

import { getItemHref } from 'utils/listItem';
import { closeImageOverlay, visibleImageSelector } from 'store/modules/sharedState';
import translator from 'utils/translator';

function Overlay() {
	const dispatch = useDispatch();

	const visibleImageItem = useSelector(visibleImageSelector);

	if (!visibleImageItem) {
		return null;
	}

	const { name } = visibleImageItem;

	return (
		<ClickEventBoundary>
			<ImageOverlay
				src={getItemHref(visibleImageItem)}
				alt={name}
				title={name}
				visible
				onClose={() => dispatch(closeImageOverlay())}
				errorMessage={translator.gettext(`We couldn’t load the image`)}
				closeTooltipText={translator.gettext('Close')}
				newTabTooltipText={translator.gettext('Open in new tab')}
			/>
		</ClickEventBoundary>
	);
}

function ClickEventBoundary({ children }) {
	return (
		<div
			onClick={(e) => {
				e.nativeEvent.stopImmediatePropagation();
			}}
		>
			{children}
		</div>
	);
}

ClickEventBoundary.propTypes = {
	children: PropTypes,
};

export default Overlay;
