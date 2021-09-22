import React from 'react';
import ReactDOM from 'react-dom';
import { once } from 'lodash';
import App from 'containers/app';
import GettingStartedContainer from 'containers/gettingStarted/main';
import {
	toggle, hide, getCompletedStages, completeStage, saveCompletedStage,
	gettingStartedMinimized, gettingStartedMaximized, gettingStartedClosed,
} from 'actions/gettingStarted';
import { track } from 'actions/tracking';
import { events } from 'constants/sesheta.json';

const defaultStages = [
	'signup_action',
	'add_deal_or_contact_action',
	'has_synced_email_action',
	'has_set_up_leadbooster',
	'has_invited_a_new_user_action',
	'mobile_device_used_action',
	'has_synced_with_google_cal_action',
	'has_checked_integrations_action',
];
const { app } = window;

export const trackGettingStartedReceived = once((dispatch) => {
	dispatch(track(events.gettingStarted.RECEIVED));
});

export default function(store, history) {
	return class GettingStarted {
		constructor(options = {}) {
			const {
				parent,
				onHide,
				appearance,
				exposedClass,
				stages,
				companySize,
				userMotive,
			} = options;

			if (!parent) {
				throw new Error(`Mount node must be HTMLELement, received ‘${typeof parent}’ instead.`);
			}

			const allowedStages = this.getAllowedStages(stages, { companySize, userMotive });

			trackGettingStartedReceived(store.dispatch);

			store.dispatch(getCompletedStages());

			const mountNode = document.createElement('DIV');

			parent.appendChild(mountNode);

			this.hide = this.hide.bind(this);
			this.toggle = this.toggle.bind(this);
			this.onHide = onHide;

			ReactDOM.render(
				<App store={store}>
					<GettingStartedContainer
						collapse={this.collapse}
						history={history}
						toggle={this.toggle.bind(this)}
						hide={this.hide.bind(this)}
						appearance={appearance}
						exposedClass={exposedClass}
						stages={allowedStages}
						completeStage={this.completeStage.bind(this)}
					/>
				</App>,
				mountNode,
			);

			const hasSeenGS = window.localStorage.getItem('has-seen-getting-started');

			if (!hasSeenGS) {
				window.localStorage.setItem('has-seen-getting-started', 'true');

				this.expand();
			}
		}

		expand() {
			const displayed = store.getState().gettingStarted.displaySidebar;

			if (!displayed) {
				store.dispatch(gettingStartedMaximized());
			}

			store.dispatch(toggle(true));

			app.global.fire('ui.event.gettingstarted.opened');
			app.global.bind('ui.event.proactive.opened', this.collapse);
		}

		collapse() {
			store.dispatch(gettingStartedMinimized());
			store.dispatch(toggle(false));

			app.global.unbind('ui.event.proactive.opened');
		}

		toggle() {
			const displayed = store.getState().gettingStarted.displaySidebar;

			if (displayed) {
				this.collapse();
			} else {
				this.expand();
			}
		}

		hide() {
			const { gettingStarted: gettingStartedStore } = store.getState();
			const panelCollapsed = gettingStartedStore.displayButton;
			const displayed = gettingStartedStore.displaySidebar;

			store.dispatch(gettingStartedClosed(displayed, { panelCollapsed }));
			store.dispatch(hide());

			if (this.onHide) {
				this.onHide();
			}
		}

		completeStage(stageName) {
			const completed = store.getState().gettingStarted.stages[stageName];

			if (!completed) {
				store.dispatch(completeStage(stageName));
				store.dispatch(saveCompletedStage(stageName));
			}
		}

		/**
		 * Simply fiters out the stages on the given conditions
		 *
		 * @param stages: the given stages
		 * @param conditions: conditions on which stages needs to be filtered
		 */
		getAllowedStages(stages = defaultStages, conditions) {
			const stagesToExclude = [];
			const { companySize, userMotive } = conditions;

			if (companySize && companySize.toString() === '1') {
				stagesToExclude.push('has_invited_a_new_user_action');
			}

			if (!userMotive || userMotive.value !== 'Qualifying and managing leads') {
				stagesToExclude.push('has_set_up_leadbooster');
			}

			if (!stagesToExclude.length) {
				return stages;
			}

			return stages.filter(stage => !stagesToExclude.includes(stage));
		}
	};
}
