import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper, Errors, Title, SVG, SingleError, GlobalMessage, Message, Code } from './styled';

interface Meta {
	message: string;
	type: string;
}

interface Extensions {
	code: string;
}

interface Error {
	message: string;
	extensions: Extensions;
}

interface Props {
	meta: Meta;
	errors: Error[];
}

function DevErrorPage({ meta, errors = [] }: Props) {
	return (
		<Wrapper>
			<SVG />
			<Title>{meta?.type ?? 'Unhandled'} Error</Title>
			<GlobalMessage>{meta?.message} Use dev tools for debugging.</GlobalMessage>
			<Errors>
				{errors.map(({ message, extensions }) => (
					<SingleError key={message}>
						<Message>{message}</Message>
						<Code>{extensions.code}</Code>
					</SingleError>
				))}
			</Errors>
		</Wrapper>
	);
}

DevErrorPage.propTypes = {
	errors: PropTypes.array,
};

export default DevErrorPage;
