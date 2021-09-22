import React from 'react';
import useQuickInfoCard from 'views/grid-react/components/use-quick-info-card';

const QuickInfoCardWrapper = ({ children, type, id, source }) => {
	const CELL_HEIGHT = 33;

	const QuickInfoCard = useQuickInfoCard();

	/**
	 * Validate that element can attach event listeners for `quick-info-card`
	 * E.g. `string` value `(Hidden)` is not valid child element
	 */
	const isValidElement = React.isValidElement(children);

	const isLegacyProductListView = type === 'product';

	if (!QuickInfoCard || !type || !id || !isValidElement || isLegacyProductListView) {
		return children;
	}

	const popoverProps = {
		portalTo: document.body,
		placement: 'right-start',
		offset: CELL_HEIGHT,
		popperProps: {
			modifiers: {
				flip: {
					behavior: ['left', 'right', 'left', 'right']
				},
				preventOverflow: {
					boundariesElement: 'viewport'
				}
			}
		}
	};

	/**
	 * We can't rely on reconciliation alone as the `quick-info-card` uses `ref` to attach event listeners
	 * to the underlying DOM element that will be shifted when list view sorting is triggered.
	 *
	 * Potentially causing the hover event to bring out a cached view of the previous entity
	 * being mounted at the same node.
	 */
	const key = `${type}-${id}`;

	return (
		<QuickInfoCard key={key} type={type} id={id} source={source} popoverProps={popoverProps}>
			{children}
		</QuickInfoCard>
	);
};

export default QuickInfoCardWrapper;
