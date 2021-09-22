import React from 'react';
import ReactDOM from 'react-dom';
import cookies from 'js-cookie';
import * as componentLoader from 'webapp-component-loader';
import { isAccountSettingsEnabled, isReseller } from '../../utils/account';

let cappingMapping;

export const render = async (el) => {
	if (!el) {
		return;
	}

	const CappingDialogComponent = await componentLoader.load('froot:cappingDialog');

	if (!cappingMapping) {
		const token = cookies.get('pipe-session-token');
		const mappingResponse = await fetch(`/v1/usage-caps/mapping?session_token=${token}`);

		cappingMapping = (await mappingResponse.json()).data;
	}

	ReactDOM.unmountComponentAtNode(el);
	ReactDOM.render(
		<CappingDialogComponent
			limitType="deals"
			tierCode={cappingMapping.currentTier}
			tierLimits={cappingMapping.mapping}
			canBill={isAccountSettingsEnabled()}
			nextTier={cappingMapping.nextTier}
			isReseller={isReseller()}
			onClose={function() {
				ReactDOM.unmountComponentAtNode(el);
			}}
		/>,
		el
	);
};
