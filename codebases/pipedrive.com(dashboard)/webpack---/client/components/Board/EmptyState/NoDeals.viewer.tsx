import React from 'react';
import { NoDealsContainer, Title, Wrap } from './StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';

export interface Props {
	children: React.ReactNode;
}

const NoDealsViewer: React.FunctionComponent<Props> = ({ children }) => {
	const translator = useTranslator();

	return (
		<NoDealsContainer data-test="no-deals-container">
			{children}
			<div data-test="no-deals-content">
				<Wrap>
					<Title>{translator.gettext('No deals added yet')}</Title>
				</Wrap>
			</div>
		</NoDealsContainer>
	);
};

export default NoDealsViewer;
