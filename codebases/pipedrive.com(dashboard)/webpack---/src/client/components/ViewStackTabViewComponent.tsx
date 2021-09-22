import React, { useState, useEffect } from 'react';
import useViewStackVisibleContext from '../hooks/useViewStackVisibleContext';
import { useDispatch } from 'react-redux';
import { setViewLoading } from '../store/navigation/actions';

interface Tab {
	route: string;
	path: string;
	tabTitle: string;
	componentName: string;
	mainTitle: string;
}

function ViewStackTabViewComponent({
	componentProps,
	componentLoader,
	tabs,
}: {
	componentLoader: ComponentLoader;
	componentProps?: any;
	tabs: Tab[];
}) {
	const visible = useViewStackVisibleContext();
	const [TabViewComponent, setTabViewComponent] = useState({ Component: null });
	const [error, setError] = useState({ ErrorPage: null });
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setViewLoading(true));
		(async () => {
			const [Component, ErrorPage] = await Promise.all([
				componentLoader.load('froot:TabViewComponent'),
				componentLoader.load('froot:ErrorPage'),
			]);

			setTabViewComponent({ Component });
			setError({ ErrorPage });
		})();
	}, []);

	if (!TabViewComponent.Component) {
		return null;
	}

	return (
		<TabViewComponent.Component
			tabs={tabs}
			onLoad={() => {
				dispatch(setViewLoading(false));
			}}
			ErrorComponent={error.ErrorPage}
			componentProps={{ ...componentProps, visible }}
		/>
	);
}

export default ViewStackTabViewComponent;
