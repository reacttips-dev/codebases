import React from 'react';
import { Icon } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import * as S from './SavedWithFilterWarning.styles';

export const SavedWithFilterWarning = () => {
	const translator = useTranslator();

	return (
		<S.InfoMessage>
			<Icon icon="info-outline" color="blue" size="s" />
			<S.Text>{translator.gettext('Selected columns are saved with the filter')}</S.Text>
		</S.InfoMessage>
	);
};
