import { createStore, compose, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import { setTranslator } from '../shared/actions/translator';
import { setInitialTemplatesOrder } from './actions/templates';
import { setUserSelf } from '../shared/actions/user-self';
import getTranslator from '@pipedrive/translator-client/fe';

export default async ({ userSelf }, setTemplatesStore) => {
	const initialState = {};
	const translator = await getTranslator('email-components', userSelf.getLanguage());

	const store = await createStore(
		reducers,
		initialState,
		compose(
			applyMiddleware(ReduxThunk),
			window.devToolsExtension ? window.devToolsExtension() : (f) => f
		)
	);

	store.dispatch(setTranslator(translator));
	store.dispatch(setInitialTemplatesOrder(userSelf.settings));
	store.dispatch(setUserSelf(userSelf));

	if (setTemplatesStore) {
		setTemplatesStore(store);
	}

	return store;
};
