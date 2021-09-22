import { Spinner } from '@pipedrive/convention-ui-react';
import React from 'react';
import styled from 'styled-components';

const radiusMap = {
	s: 8,
	l: 16,
	xl: 32,
};

const Loader = styled.div<{ size: keyof typeof radiusMap }>`
	position: relative;
	width: ${({ size }) => radiusMap[size] * 2}px;
	top: calc(50% - ${({ size }) => radiusMap[size]}px);
	left: calc(50% - ${({ size }) => radiusMap[size]}px);
`;

const Loading = ({ size = 'xl' }: { size?: keyof typeof radiusMap }) => (
	<Loader size={size}>
		<Spinner size={size} />
	</Loader>
);

export default Loading;
