import { useContext } from 'react';
import TranslatorContext from './translator-context';

function useTranslator() {
	return useContext(TranslatorContext);
}

export { useTranslator };
