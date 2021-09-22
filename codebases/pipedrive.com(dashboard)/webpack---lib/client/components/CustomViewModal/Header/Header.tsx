import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import * as S from './Header.styles';

export const Header: React.FC = ({ children }) => {
	const translator = useTranslator();

	return (
		<S.HeaderWrapper>
			<S.Heading>{translator.gettext('Customize columns')}</S.Heading>
			{children}
		</S.HeaderWrapper>
	);
};
