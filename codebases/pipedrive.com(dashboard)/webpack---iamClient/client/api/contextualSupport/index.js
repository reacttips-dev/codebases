import React from 'react';
import ReactDOM from 'react-dom';
import { find } from 'lodash';
import { push } from 'react-router-redux';
import { searchActions, articleActions, sidebarActions } from 'actions/contextualSupport';
import App from 'containers/app';
import SidebarContainer from 'containers/contextualSupport/main';
import routes from 'constants/contextualSupport/routes';
import { closeAndPossiblyNotify } from 'actions/coachmarks';
import { coachmarksStore } from '../../store';

import style from './style.css';

const getFullPath = () => {
	return `${window.location.pathname}${window.location.hash}`;
};

const { app } = window;

const emitSidebarStatusChange = isVisible => {
	// php-app does not have Backbone events
	if (app && app.global && app.global.fire) {
		app.global.fire('ui.event.sidebar.toggle', isVisible);
	}
};

const bindProactiveOpened = hide => {
	if (app && app.global && app.global.bind) {
		app.global.bind('ui.event.proactive.opened', hide);
	}
};

const unbindProactiveOpened = () => {
	if (app && app.global && app.global.unbind) {
		app.global.unbind('ui.event.proactive.opened');
	}
};

const suggestArticles = (store) => (url) => {
	const displayed = store.getState().support.sidebar.display;

	if (displayed) {
		const path = typeof url === 'object' ? url.path : url;

		store.dispatch(articleActions.suggest(path || getFullPath()));
	}
};

export default function(store, history) {
	return {
		Sidebar: class Sidebar {
			constructor(parent, options = {}) {
				if (!parent) {
					throw new Error(`Mount node must be HTMLELement, received ‘${typeof parent}’ instead.`);
				}

				const {
					appearance,
					exposedClass,
					gettingStarted,
					companySize,
					userMotive,
				} = options;

				const mountNode = document.createElement('DIV');

				mountNode.className = style.Mount;

				parent.appendChild(mountNode);

				ReactDOM.render(
					<App store={store}>
						<SidebarContainer
							hide={this.hide}
							history={history}
							suggest={this.suggest}
							appearance={appearance}
							exposedClass={exposedClass}
							gettingStarted={gettingStarted}
							companySize={companySize}
							userMotive={userMotive}
						/>
					</App>,
					mountNode,
				);
			}

			show(source, term = '') {
				bindProactiveOpened(this.hide);
				emitSidebarStatusChange(true);

				const currentPathName = getFullPath();
				const lastPathName = store.getState().support.suggestions.lastRequest;

				if (lastPathName !== currentPathName) {
					this.suggest(currentPathName);
				}

				if (term.length) {
					store.dispatch(searchActions.search(term));
				}

				store.dispatch(sidebarActions.toggle(true, source));
			}

			hide() {
				const displayed = store.getState().support.sidebar.display;

				if (!displayed) {
					return;
				}

				unbindProactiveOpened();
				emitSidebarStatusChange(false);
				store.dispatch(sidebarActions.toggle(false, ''));

				if (window.localStorage.getItem('iam-client-sidebar.closed') <= 3 || !window.localStorage.getItem('iam-client-sidebar.closed')) {
					window.localStorage.setItem('iam-client-sidebar.closed', (Number(window.localStorage.getItem('iam-client-sidebar.closed')) || 0) + 1);
					const date = new Date();

					window.localStorage.setItem('iam-client-sidebar.closed-time', `${date.getTime()}`);
				}
			}

			toggle(term = '') {
				const displayed = store.getState().support.sidebar.display;

				if (displayed) {
					this.hide();
				} else {
					const gettingStartedClosedTag = 'emnt_gettingStartedV2_closedCoachMark';
					const isTagInQueue = find(
						coachmarksStore.getState().coachmarks.queue,
						{
							tag: gettingStartedClosedTag,
						});

					if (isTagInQueue) {
						coachmarksStore.dispatch(closeAndPossiblyNotify(gettingStartedClosedTag));
					}

					this.show('', term);
				}
			}

			toggleFlowView() {
				const displayed = store.getState().support.sidebar.display;

				if (displayed) {
					this.hide();
				} else {
					store.dispatch(push('/contextual-support/flow'));
					this.show('onboarding_widget');
				}
			}

			suggest(url) {
				suggestArticles(store)(url);
			}

			openArticle(id, language) {
				const articleLanguage = language || store.getState().user.userLang;

				if (id && articleLanguage) {
					store.dispatch(sidebarActions.toggle(true));
					store.dispatch(push(`${routes.ARTICLE}/${id}/${articleLanguage}`));
				}
			}
		},
		suggestArticles: suggestArticles(store),
	};
}
