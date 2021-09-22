import React from 'react';
import { Icon, IconProps } from '@pipedrive/convention-ui-react';

interface Props {
	readonly size?: IconProps['size'];
	readonly color?: IconProps['color'];
}

export const WebsiteVisitorsIcon: React.FC<Props> = ({ size, color }) => (
	<Icon icon="web-visitors" size={size} color={color} />
);
