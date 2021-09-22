import React from 'react';
import { Icon, IconProps } from '@pipedrive/convention-ui-react';

interface Props {
	size?: IconProps['size'];
	color?: IconProps['color'];
}

export const DealIcon: React.FC<Props> = ({ size, color }) => <Icon icon="deal" size={size} color={color} />;
