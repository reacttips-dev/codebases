import { useState, useEffect } from 'react';
import { getComponentLoader } from '../shared/api/webapp/index';

type State = {
	Component?: React.FunctionComponent<any> | null;
};

export default function useExternalComponent(componentName: string) {
	// It needs to be an object as we cannot save a function as root state.
	const [Components, setComponents] = useState<State>({});

	useEffect(() => {
		getComponentLoader()
			.load(componentName)
			.then((LoadedComponent) => {
				if (!LoadedComponent) {
					return;
				}

				if (LoadedComponent.__esModule) {
					setComponents({ [componentName]: LoadedComponent.default });
				} else {
					setComponents({ [componentName]: LoadedComponent });
				}
			});
	}, []);

	return Components[componentName];
}
