import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import ErrorBoundary from '../shared/components/error-boundary';
import TranslatorContext from 'utils/translator/translator-context';
import { APIContext, MailConnectionsContext, UsageTrackingContext } from 'shared/contexts';
import { StoreProvider } from './store';
import createTemplatesStore from 'templates/create-store';
import UsageTracking from 'utils/usage-tracking';
import getTranslator from '@pipedrive/translator-client/fe';

const SendGroupEmail = (props) => {
	const { API, MailConnections, getDragDropContext, componentProps } = props;

	const [Component, setComponent] = useState(null);
	const [translator, setTranslator] = useState(null);
	const [hot, setHot] = useState(null);
	const [templatesStore, setTemplatesStore] = useState(null);

	const DragDropContext = useMemo(getDragDropContext, [getDragDropContext]);
	const usageTracking = useMemo(() => new UsageTracking({ API }), [API]);

	useMemo(() => createTemplatesStore(API, setTemplatesStore), [API]);

	useEffect(() => {
		async function translator() {
			const translatorClient = await getTranslator(
				'email-components',
				API.userSelf.getLanguage()
			);

			setTranslator(translatorClient);
		}

		translator();
	}, [API.userSelf]);

	useEffect(() => {
		const Component = require('./components/send-group-email').default;

		setComponent(() => Component);
	}, [hot]);

	/** This is needed for HMR */
	const DraggableSendGroupEmail = useMemo(() => {
		if (Component) {
			return DragDropContext(Component);
		} else {
			return () => null;
		}
	}, [Component, DragDropContext]);

	if (module.hot) {
		module.hot.accept(['./components/send-group-email'], () => {
			setHot(Math.random());
		});
	}

	if (!templatesStore) {
		return null;
	}

	return (
		<ErrorBoundary componentName="send-group-email">
			<Provider store={templatesStore}>
				<APIContext.Provider value={API}>
					<MailConnectionsContext.Provider value={MailConnections}>
						<TranslatorContext.Provider value={translator}>
							<UsageTrackingContext.Provider value={usageTracking}>
								<StoreProvider>
									<DraggableSendGroupEmail {...componentProps} />
								</StoreProvider>
							</UsageTrackingContext.Provider>
						</TranslatorContext.Provider>
					</MailConnectionsContext.Provider>
				</APIContext.Provider>
			</Provider>
		</ErrorBoundary>
	);
};

SendGroupEmail.propTypes = {
	API: PropTypes.object,
	MailConnections: PropTypes.array,
	getDragDropContext: PropTypes.func,
	componentProps: PropTypes.object
};

export default SendGroupEmail;
