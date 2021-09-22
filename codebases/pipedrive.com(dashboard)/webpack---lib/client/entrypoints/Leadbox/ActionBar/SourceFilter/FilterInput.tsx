import React from 'react';
import { Input } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import * as S from './FilterInput.styles';

interface Props {
	readonly setSearchValue: (searchValue: string) => void;
}

export const FilterInput: React.FC<Props> = ({ setSearchValue }) => {
	const translator = useTranslator();

	return (
		<S.SearchWrapper>
			<Input
				allowClear
				autoFocus
				onChange={(event) => setSearchValue(event.target.value)}
				icon="ac-search"
				placeholder={translator.gettext('Search source')}
			/>
		</S.SearchWrapper>
	);
};
