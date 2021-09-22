import React, { useContext, useState } from 'react';
import { WebappApiContext } from 'Components/WebappApiContext';

export function useExternalComponent<T = React.ElementType>(componentName: string): T | null {
	const [components, setComponents] = useState<{ [name: string]: T }>({});
	const { componentLoader } = useContext(WebappApiContext);

	React.useEffect(() => {
		componentLoader
			.load(componentName)
			.then((LoadedComponent: T) => {
				setComponents({ [componentName]: LoadedComponent });
			})
			.catch((error) => {
				// eslint-disable-next-line no-warning-comments
				// TODO: log this failure (serious issue because the component failed to load)
				// eslint-disable-next-line no-console
				console.error('Unable to load external component: %s', componentName, error);
			});
	}, [componentLoader, componentName]);

	return components[componentName] ?? null;
}
