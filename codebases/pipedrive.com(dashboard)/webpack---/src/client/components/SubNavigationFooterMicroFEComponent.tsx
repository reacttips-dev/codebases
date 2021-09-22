import React, { useState, useEffect } from 'react';
import useToolsContext from '../hooks/useToolsContext';

function SubNavigationFooterMicroFEComponent({
	componentName,
	componentProps,
}: {
	componentName: string;
	componentProps?: any;
}) {
	const { componentLoader } = useToolsContext();
	const [MicroFEComponent, setMicroFEComponent] = useState({ Component: null });

	useEffect(() => {
		(async () => {
			const Component = await componentLoader.load('froot:MicroFEComponent');

			setMicroFEComponent({ Component });
		})();
	}, []);

	if (!MicroFEComponent.Component) {
		return null;
	}

	return (
		<MicroFEComponent.Component
			componentName={componentName}
			ErrorComponent={null}
			componentProps={{ ...componentProps, visible: true }}
		/>
	);
}

export default SubNavigationFooterMicroFEComponent;
