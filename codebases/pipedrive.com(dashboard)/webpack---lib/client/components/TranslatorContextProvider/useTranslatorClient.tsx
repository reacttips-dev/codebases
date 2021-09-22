import getTranslator from '@pipedrive/translator-client/fe';
import { useState, useEffect } from 'react';
import TranslatorClient from '@pipedrive/translator-client';

const getTranslations = async (language: string, projectName: string) => {
	const translatorClient = await getTranslator(projectName, language);

	return translatorClient;
};

export const useTranslatorClient = (projectName: string, userLanguage: string) => {
	const [translatorClient, setTranslatorClient] = useState<TranslatorClient>();

	useEffect(() => {
		getTranslations(userLanguage, projectName).then(setTranslatorClient);
	}, [projectName, userLanguage]);

	return [translatorClient];
};
