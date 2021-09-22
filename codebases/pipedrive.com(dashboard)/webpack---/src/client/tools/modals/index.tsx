import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';

import { openModal, closeModal, reOpenModal } from './store/actions';
import { modalReducer } from './store/reducers';
import { ModalHost } from './components/ModalHost';

const store = createStore(modalReducer);

export default async function (componentLoader) {
	const MicroFEComponent = await componentLoader.load('froot:MicroFEComponent');
	const element = document.createElement('div');

	document.body.appendChild(element);

	render(
		<Provider store={store}>
			<ModalHost MicroFEComponent={MicroFEComponent} />
		</Provider>,
		element,
	);

	return {
		open(modalName: string, options?: any) {
			store.dispatch(openModal(modalName, options));
		},
		close(type?: string) {
			const modalType = store.getState().modalName;

			// Hacky and should be removed when we figure out the proper behaviour of modals
			if ((type && type === 'webapp' && modalType !== null && modalType.includes('webapp:modal')) || !type) {
				store.dispatch(closeModal());
			}
		},
		reOpen() {
			store.dispatch(reOpenModal());
		},
	};
}
