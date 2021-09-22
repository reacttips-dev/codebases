import { Tooltip } from '@pipedrive/convention-ui-react';
import React from 'react';

interface ConditionalTooltipProps {
	children: React.ReactNode;
	content: React.ReactNode;
	show?: boolean;
}

export function ConditionalTooltip({ show, content, children }: ConditionalTooltipProps) {
	if (show) {
		return (
			<Tooltip placement="right" content={content} innerRefProp="ref">
				{children}
			</Tooltip>
		);
	}

	return <>{children}</>;
}
