import styled from 'styled-components';
import React, { useContext } from 'react';

import { ApiContext } from '../../utils/ApiContext';
import { useSelector } from 'react-redux';
import { ViewState } from '../../store/types';

const Main = styled.div`
	flex: 1 1 100%;
	overflow-y: auto;
`;

const WrapperComponent = () => {
	const { componentName, componentOptions } = useSelector((s: ViewState) => s.options);
	const { MicroFEComponent } = useContext(ApiContext);

	return (
		<Main data-test="contextual-view">
			<MicroFEComponent
				showSpinner
				key={`Drawer__${componentName}`}
				componentName={componentName}
				componentProps={componentOptions}
			/>
		</Main>
	);
};

export default WrapperComponent;
