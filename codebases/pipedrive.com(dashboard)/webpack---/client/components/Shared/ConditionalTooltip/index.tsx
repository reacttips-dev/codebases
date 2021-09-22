import React from 'react';
import { Tooltip, TooltipProps } from '@pipedrive/convention-ui-react';

type Props = TooltipProps & {
	condition: boolean;
};

const ConditionalTooltip: React.FunctionComponent<Props> = ({ condition, ...tooltipProps }) => {
	const getTooltipVisibleProp = () => {
		if (!condition) {
			return { visible: false };
		}

		return null;
	};

	return (
		<Tooltip
			popperProps={{
				modifiers: {
					preventOverflow: {
						enabled: true,
						padding: 20,
						boundariesElement: document.body,
					},
				},
			}}
			{...tooltipProps}
			{...getTooltipVisibleProp()}
		/>
	);
};

export default ConditionalTooltip;
