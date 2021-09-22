import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import * as S from './NoResults.styles';

export const NoResults: React.FC = () => {
	const translator = useTranslator();

	return (
		<S.NoResultsWrapper>
			<S.NoResultsHeading>{translator.gettext('No match found')}</S.NoResultsHeading>
			<S.NoResultsBody>{translator.gettext('Please check your spelling')}</S.NoResultsBody>
		</S.NoResultsWrapper>
	);
};
