import React, { useEffect } from 'react';
import Logger from '@pipedrive/logger-fe';

import useComponentLoader from '../../hooks/useComponentLoader';
import Loading from '../../components/Loading';
import MicroApp from './MicroApp';
import ErrorBoundary from '../ErrorBoundary';

function isReactComponent(component) {
	return component && typeof component === 'function';
}

function isMicroApp(app) {
	return app && typeof app === 'object' && typeof app.mount === 'function';
}

export default async (componentLoader) => {
	function MicroFEComponent({
		componentName,
		componentProps,
		onLoad,
		ErrorComponent,
		showSpinner,
	}: {
		componentName: string;
		componentProps: any;
		onLoad?: () => void;
		ErrorComponent?: Function;
		showSpinner?: boolean;
	}) {
		const logger = new Logger(componentName, 'MicroFEComponent');

		const [Component, hasError] = useComponentLoader(componentName, componentLoader);

		useEffect(() => {
			if (Component || (!Component && hasError)) {
				onLoad?.();
			}
		}, [onLoad, Component, hasError]);

		if (Component && !hasError) {
			const props = { ...componentProps, componentLoader };

			if (isReactComponent(Component)) {
				return (
					<ErrorBoundary componentName={componentName}>
						<Component {...props} />
					</ErrorBoundary>
				);
			} else if (isMicroApp(Component)) {
				return (
					<ErrorBoundary componentName={componentName}>
						<MicroApp app={Component} props={props} />
					</ErrorBoundary>
				);
			} else {
				logger.warn(
					`Froot cannot render ${componentName}, unsupported interface provided for ${componentName}`,
				);
			}
		} else if (hasError && isReactComponent(ErrorComponent)) {
			return <ErrorComponent />;
		}

		if (showSpinner) {
			return <Loading size="l" />;
		}

		return null;
	}

	return MicroFEComponent;
};
