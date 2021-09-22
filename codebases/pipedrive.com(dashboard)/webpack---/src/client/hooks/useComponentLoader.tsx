import { useEffect, useState } from 'react';

import Logger from '@pipedrive/logger-fe';
import asyncRetry from '../utils/asyncRetry';

export default function useComponentLoader(componentName: string, componentLoader: ComponentLoader) {
	const [{ component }, setComponent] = useState({ component: null });
	const logger = new Logger(componentName, 'useComponentLoader');
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		async function loadComponent() {
			try {
				setHasError(false);
				const component = await asyncRetry(() => componentLoader.load(componentName), {
					attempts: 2,
					delayMs: 0,
				});
				setComponent({ component });
			} catch (error) {
				setHasError(true);
				logger.logError(error, `Froot cannot load component ${componentName}: ${error.message}`);
			}
		}
		loadComponent();
	}, [componentName, componentLoader]);

	return [component, hasError];
}
