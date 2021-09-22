import React from 'react';
import styled from 'styled-components';
import { Spinner } from '@pipedrive/convention-ui-react';

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
`;

type Props = {
	readonly grayed: boolean;
};

export const LeadsListLoader: React.FC<Props> = ({ grayed }) => {
	return (
		<Wrapper>
			<Spinner size="l" light={grayed} />
		</Wrapper>
	);
};
