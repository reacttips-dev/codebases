import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Search from 'components/Search';
import WithHotReload from 'components/WithHotReload';
import ErrorBoundary from 'components/ErrorBoundary';
import getStore from 'store';
import translator from 'utils/translator';
import { AppContext } from 'utils/AppContext';
import { fetchQuickInfoCard } from 'utils/helpers';
import { initLocalStorageKey } from 'utils/keywords';
import tracker from 'utils/tracking';

function createSearchFE(contextTools) {
	return class SearchFE extends Component {
		static propTypes = {
			toggleSupport: PropTypes.func.isRequired,
			hideSupport: PropTypes.func.isRequired,
			tooltipProps: PropTypes.object.isRequired,
			useSearchHotKey: PropTypes.func.isRequired,
		};

		shouldComponentUpdate() {
			return false;
		}

		render() {
			const appContextValue = {
				...contextTools,
				supportSidebar: {
					toggle: this.props.toggleSupport,
					hide: this.props.hideSupport,
				},
			};

			return (
				<ErrorBoundary>
					<WithHotReload>
						<Provider store={getStore()}>
							<AppContext.Provider value={appContextValue}>
								<Search {...this.props} />
							</AppContext.Provider>
						</Provider>
					</WithHotReload>
				</ErrorBoundary>
			);
		}
	};
}

export default async function (componentLoader) {
	const [user, router, metrics, modals, QuickInfoCard] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('froot:router'),
		componentLoader.load('webapp:metrics'),
		componentLoader.load('froot:modals'),
		fetchQuickInfoCard(componentLoader),
	]);

	await translator.init(user.getLanguage());
	tracker.init(metrics);
	initLocalStorageKey(user);

	return () => createSearchFE({ user, router, componentLoader, QuickInfoCard, modals });
}
