import React from 'react';
import { Icon } from '@pipedrive/convention-ui-react';
import styled from 'styled-components';

import { MenuLogo } from './types';

interface Props {
	item: MenuLogo;
}

export const StyledNavBarIcon = styled.a`
	display: flex;
	justify-content: center;
	padding: 13px;
`;

const StyledIcon = styled(Icon)`
	width: 30px;
	height: 30px;
`;

export function NavBarIcon({ item }: Props) {
	return (
		<StyledNavBarIcon href={item.path}>
			<StyledIcon icon={item.icon} color="white" />
		</StyledNavBarIcon>
	);
}
