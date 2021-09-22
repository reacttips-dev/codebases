import React, { useState, useEffect, useContext } from 'react';
import { ApiContext } from '../../../utils/ApiContext';

export function MarketingStatusField({ onComponentChange }: { onComponentChange: any }) {
	const { componentLoader } = useContext(ApiContext);
	const [MicroFEComponent, setMicroFEComponent] = useState({ Component: null });

	useEffect(() => {
		(async () => {
			const Component = await componentLoader.load('marketing-ui:marketingStatusSelect');
			setMicroFEComponent({ Component });
		})();
	}, []);

	if (!MicroFEComponent.Component) {
		return null;
	}

	return <MicroFEComponent.Component onChange={onComponentChange} showHint conditional={false} state="edit" />;
}
