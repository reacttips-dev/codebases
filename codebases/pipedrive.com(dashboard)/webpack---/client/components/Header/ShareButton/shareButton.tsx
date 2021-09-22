import React from 'react';
import useExternalComponent from '../../useExternalComponent';
import { SpinnerContainer } from './StyledComponents';

export const ShareButton = ({ filters }) => {
	const Menu = useExternalComponent('viewer-fe');

	return <SpinnerContainer>{Menu && <Menu filters={filters} />}</SpinnerContainer>;
};
