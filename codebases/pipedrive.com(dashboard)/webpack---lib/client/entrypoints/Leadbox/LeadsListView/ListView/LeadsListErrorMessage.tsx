import React, { useContext } from 'react';
import styled from 'styled-components';
import { Message } from '@pipedrive/convention-ui-react';
import { UIContext } from 'Leadbox/UIContext';
import { useTranslator } from '@pipedrive/react-utils';

const ErrorMessageWrapper = styled.div`
	margin: 16px 16px 0 16px;
`;

const InnerMessageWrapper = styled.div`
	padding: 2px;
`;

export function LeadsListErrorMessage() {
	const translator = useTranslator();
	const uiContext = useContext(UIContext);
	const isVisible = uiContext.errorMessage.isVisible;

	const handleOnErrorClose = () => {
		uiContext.errorMessage.hide();
	};

	if (!isVisible) {
		return null;
	}

	// Please note: we currently have only one error message in the whole application so we
	// hardcoded it. However, we should iterate on it later when needed and expand the features.
	const errorMessage = translator.gettext("Couldn't complete bulk action. Please try again.");

	return (
		<ErrorMessageWrapper>
			<Message visible={isVisible} color="red" icon="warning" onClose={handleOnErrorClose}>
				<InnerMessageWrapper data-testid="LeadsListErrorMessageText">{errorMessage}</InnerMessageWrapper>
			</Message>
		</ErrorMessageWrapper>
	);
}
