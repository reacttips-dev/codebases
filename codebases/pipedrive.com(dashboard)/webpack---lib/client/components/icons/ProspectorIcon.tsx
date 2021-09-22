import React from 'react';
import { Icon, IconProps } from '@pipedrive/convention-ui-react';

interface Props {
	size?: IconProps['size'];
	color?: IconProps['color'];
}

export const ProspectorIcon: React.FC<Props> = ({ size, color }) => (
	<Icon icon="prospecting" size={size} color={color} />
);
