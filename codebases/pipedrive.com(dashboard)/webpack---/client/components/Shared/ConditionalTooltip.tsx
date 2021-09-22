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

	return <Tooltip {...tooltipProps} {...getTooltipVisibleProp()} />;
};

export default ConditionalTooltip;