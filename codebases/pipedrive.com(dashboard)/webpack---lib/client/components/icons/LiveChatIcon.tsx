import React from 'react';
import { Icon, IconProps } from '@pipedrive/convention-ui-react';

interface Props {
	size?: IconProps['size'];
	color?: IconProps['color'];
}

export const LiveChatIcon: React.FC<Props> = ({ size, color }) => <Icon icon="ac-bubble" size={size} color={color} />;
