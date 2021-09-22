import { Tooltip, PopoverPlacement } from '@pipedrive/convention-ui-react';
import React from 'react';

import stackOrder from './stackOrder';

interface MenuItemProps {
	children: React.ReactNode;
	innerRef?(): void;
}

const Trigger = ({ children, innerRef, ...props }: MenuItemProps) => {
	return <div {...{ ref: innerRef, ...props }}>{children}</div>;
};

interface Props {
	children?: React.ReactNode;
	content: React.ReactNode;
	placement?: PopoverPlacement;
}

export function NavTooltip({ children, content, placement }: Props) {
	return (
		<Tooltip
			content={content}
			placement={placement || 'right'}
			innerRefProp="innerRef"
			mouseEnterDelay={0}
			mouseLeaveDelay={0}
			style={{ zIndex: stackOrder.navBarItemTooltip }}
		>
			<Trigger>{children}</Trigger>
		</Tooltip>
	);
}

export default NavTooltip;
