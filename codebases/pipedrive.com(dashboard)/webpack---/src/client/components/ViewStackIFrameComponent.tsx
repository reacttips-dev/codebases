import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useViewStackVisibleContext from '../hooks/useViewStackVisibleContext';
import { setViewLoading } from '../store/navigation/actions';

function ViewStackIFrameComponent({
	componentProps,
	componentLoader,
}: {
	componentLoader: ComponentLoader;
	componentProps?: any;
}) {
	const visible = useViewStackVisibleContext();
	const [Component, setComponent] = useState({ IFrameComponent: null, ErrorPage: null });
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setViewLoading(true));
		(async () => {
			const [IFrameComponent, ErrorPage] = await Promise.all([
				componentLoader.load('froot:IFrameComponent'),
				componentLoader.load('froot:ErrorPage'),
			]);

			setComponent({ IFrameComponent, ErrorPage });
		})();
	}, []);

	if (!Component.IFrameComponent) {
		return null;
	}

	return (
		<Component.IFrameComponent
			onLoad={() => {
				dispatch(setViewLoading(false));
			}}
			ErrorComponent={Component.ErrorPage}
			{...componentProps}
			visible={visible}
		/>
	);
}

export default ViewStackIFrameComponent;
