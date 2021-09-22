import React, { useState, useEffect } from 'react';
import useViewStackVisibleContext from '../hooks/useViewStackVisibleContext';
import { useDispatch } from 'react-redux';
import { setViewLoading } from '../store/navigation/actions';

function ViewStackMicroFEComponent({
	componentName,
	componentProps,
	componentLoader,
}: {
	componentName: string;
	componentLoader: ComponentLoader;
	componentProps?: any;
}) {
	const visible = useViewStackVisibleContext();
	const [MicroFEComponent, setMicroFEComponent] = useState({ Component: null });
	const [error, setError] = useState({ ErrorPage: null });
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setViewLoading(true));
		(async () => {
			const [Component, ErrorPage] = await Promise.all([
				componentLoader.load('froot:MicroFEComponent'),
				componentLoader.load('froot:ErrorPage'),
			]);

			setMicroFEComponent({ Component });
			setError({ ErrorPage });
		})();
	}, []);

	if (!MicroFEComponent.Component) {
		return null;
	}

	return (
		<MicroFEComponent.Component
			componentName={componentName}
			onLoad={() => {
				dispatch(setViewLoading(false));
			}}
			ErrorComponent={error.ErrorPage}
			componentProps={{ ...componentProps, visible }}
		/>
	);
}

export default ViewStackMicroFEComponent;
