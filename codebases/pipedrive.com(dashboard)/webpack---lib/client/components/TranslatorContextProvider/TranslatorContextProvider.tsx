import React, { useEffect } from 'react';
import { TranslatorContext } from '@pipedrive/react-utils';
import { setTranslatorReference } from 'Utils/translator';

import { useTranslatorClient } from './useTranslatorClient';

interface Props {
	userLanguage: string;
	projectName: string;
}

export const TranslatorContextProvider: React.FC<Props> = ({ children, userLanguage, projectName }) => {
	const [translatorClient] = useTranslatorClient(projectName, userLanguage);

	useEffect(() => {
		if (translatorClient) {
			setTranslatorReference(translatorClient);
		}
	}, [translatorClient]);

	if (translatorClient === undefined) {
		return null;
	}

	return <TranslatorContext.Provider value={translatorClient}>{children}</TranslatorContext.Provider>;
};
