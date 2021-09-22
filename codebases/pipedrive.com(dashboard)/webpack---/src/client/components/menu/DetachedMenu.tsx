import React from 'react';
import styled from 'styled-components';
import { useTranslator } from '@pipedrive/react-utils';

import { stackOrder } from './stackOrder';
import config from '../../config/styles';

const NavMenuContent = styled.div`
	width: ${config.subNavigationWidth}px;
	margin-left: auto;
	padding: 8px 0;
	box-sizing: border-box;
`;

const StyledRoot = styled.nav`
	--content-width: ${config.detachedContentWidth.fallback}px;

	@media only screen and (min-width: ${config.breakpoints.m}px) {
		--content-width: ${config.detachedContentWidth.m}px;
	}

	@media only screen and (min-width: ${config.breakpoints.l}px) {
		--content-width: ${config.detachedContentWidth.l}px;
	}

	--container-width: calc(
		(100vw - var(--content-width) - ${config.navBarWidth}px - ${config.subNavigationWidth}px) / 2 +
			${config.subNavigationWidth}px
	);

	position: relative;
	z-index: ${stackOrder.navMenu};
	min-width: ${config.subNavigationWidth}px;
	width: var(--container-width);
`;

interface Props {
	children?: React.ReactNode;
}

export function DetachedMenu({ children }: Props) {
	const translator = useTranslator();

	return (
		<>
			<StyledRoot aria-label={translator.gettext('Secondary')}>
				<NavMenuContent>{children}</NavMenuContent>
			</StyledRoot>
		</>
	);
}
