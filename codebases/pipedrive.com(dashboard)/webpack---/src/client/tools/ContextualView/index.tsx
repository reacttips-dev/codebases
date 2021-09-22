import { render } from 'react-dom';
import { createStore } from 'redux';
import React from 'react';

import { openDrawer, closeDrawer } from './store/actions';
import { contextualViewReducer } from './store/reducers';
import { Drawer } from './components/Drawer';
import getTranslator from '@pipedrive/translator-client/fe';
import { Provider } from 'react-redux';
import { ApiContext } from './utils/ApiContext';

const store = createStore(contextualViewReducer);

export type ContextualViewOptions = {
	componentName: string;
	componentOptions: any;
	id?: string;
	onClose?: () => void;
	onPrevious?: () => void;
	onNext?: () => void;
	hasSidebar?: boolean;
	customStyle_DO_NOT_USE?: React.CSSProperties;
};

export default async function (componentLoader) {
	const element = document.createElement('div');
	const MicroFEComponent = await componentLoader.load('froot:MicroFEComponent');
	const user = await componentLoader.load('webapp:user');
	const metrics = await componentLoader.load('webapp:metrics');
	const translator = await getTranslator('froot', user?.getLanguage());

	document.body.appendChild(element);

	render(
		<Provider store={store}>
			<ApiContext.Provider value={{ componentLoader, MicroFEComponent, translator, metrics, user }}>
				<Drawer />
			</ApiContext.Provider>
		</Provider>,
		element,
	);

	return {
		open(options: ContextualViewOptions) {
			store.dispatch(openDrawer(options));
		},
		close() {
			store.dispatch(closeDrawer());
		},
		isOpen(id?: string) {
			const { visible, options } = store.getState();

			return visible && (!id || options?.id === id);
		},
	};
}
