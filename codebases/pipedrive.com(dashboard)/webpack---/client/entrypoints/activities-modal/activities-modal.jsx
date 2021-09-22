import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStore } from 'redux';
import { batch, Provider } from 'react-redux';
import { FormFieldsContext } from '@pipedrive/form-fields';
import { ErrorBoundary } from '@pipedrive/react-utils';
import ErrorCard from '../../common-components/ErrorCard';
import { withWebApiAndTranslatorLoader } from '../../utils/hocs';
import composeMiddleware from '../../compose-middleware';
import { Provider as ContextProvider } from '../../utils/context';
import reducers, { getInitialState } from './store/reducers';
import { prepopulateActivityFromParams, setNewActivityRelatedModel } from './store/actions/form';
import { loadActivityById } from './store/actions/request-state';
import { setNotificationsLanguage } from './store/actions/notifications';
import {
	hideModal,
	setLanguages,
	showModal,
	setCalendarSyncTeaserVisibility,
	enableFlowView,
	getConferenceMeetingIntegrationInstalled,
	getHasActiveCalendarSync,
} from './store/actions/modal';
import { setExternalMeta } from './tracking/actions';
import { setActivityTypes, setDefaultActivityType } from './store/actions/defaults';

import { withTracking } from './tracking/middleware';
import { trackActionsHistory } from './actions-tracker/middleware';

const toNumber = (id) => (id && !isNaN(Number(id)) ? Number(id) : id);

class ActivitiesModal extends Component {
	constructor(props) {
		super(props);

		const onSave = (params) => {
			if (this.props.onsave) {
				try {
					this.props.onsave(params);
				} catch (e) {
					this.props.logger.remote('error', 'onsave callback failed', {
						...((e && e.message) || {}),
					});
				}
			}
		};
		const webappApi = props.webappApi;
		const logger = props.logger;

		this.notifyChangesExternally = (...rest) => {
			if (!webappApi.socketHandler || !webappApi.socketHandler.notify) {
				return;
			}

			try {
				webappApi.socketHandler.notify(...rest);
			} catch (e) {
				logger.remote('error', 'Error when calling webappApi.socketHandler.notify', e);
			}
		};
		this.closeModal = this.closeModal.bind(this);
		this.afterCloseModal = this.afterCloseModal.bind(this);
		this.socketHandler = this.socketHandler.bind(this);

		this.store = createStore(
			reducers,
			getInitialState(),
			composeMiddleware(
				logger,
				{
					webappApi,
					translator: this.props.translator,
					onSave,
					notifyChangesExternally: this.notifyChangesExternally,
					closeModal: this.closeModal,
					afterCloseModal: this.afterCloseModal,
					isContextualView: props.isContextualView,
				},
				withTracking(webappApi, props.source, props.isContextualView),
				trackActionsHistory,
			),
		);

		if (module.hot) {
			module.hot.accept(
				[
					'./store/reducers',
					'./components/activity-dialog',
					// other stuff you still want to do hot reload on, most probably redundant
					'./with-coachmarks',
					'./tracking/reducer',
					'./tracking/metrics',
					'./tracking/middleware',
					'../../utils/context',
					'../../utils/hocs',
				],
				() => {
					this.store.replaceReducer(require('./store/reducers').default);
					this.forceUpdate();
				},
			);
		}
	}

	closeModal() {
		if (this.props.isFlowView) {
			this.props.hideFlowView && this.props.hideFlowView();
			this.forceUpdate();
		}

		if (this.props.onClose) {
			this.props.onClose();
		}

		if (this.props.isFlowView) {
			this.afterCloseModal();
		}

		this.store.dispatch(hideModal());
	}

	afterCloseModal() {
		if (this.props.onAfterClose) {
			this.props.onAfterClose();
		}
	}

	socketHandler(event) {
		if (event.alert_type === 'user_provider_link') {
			this.store.dispatch(getConferenceMeetingIntegrationInstalled(false));
		}
	}

	componentDidMount() {
		const { isFlowView, onRender, webappApi } = this.props;
		const dispatch = this.store.dispatch;

		this.loadActivityFromProps();

		batch(() => {
			dispatch(showModal());
			dispatch(setCalendarSyncTeaserVisibility());
			dispatch(getHasActiveCalendarSync());
			dispatch(getConferenceMeetingIntegrationInstalled());

			if (isFlowView) {
				dispatch(enableFlowView());
			}
		});

		webappApi.socketHandler.on('api.', this.socketHandler);

		if (isFlowView && onRender) {
			onRender();
		}
	}

	componentWillUnmount() {
		this.props.webappApi.router.off('route', this.closeModal);
		this.props.webappApi.socketHandler.off('api.', this.socketHandler);
	}

	componentDidUpdate(prevProps) {
		if (this.props.isContextualView && prevProps.activityId === this.props.activityId) {
			return;
		}

		batch(() => {
			this.loadActivityFromProps();

			this.store.dispatch(showModal());
		});
	}

	loadActivityFromProps() {
		const {
			activityId,
			relatedModel,
			next,
			lead,
			project,
			dealId,
			personId,
			orgId,
			activityData,
			meta,
			webappApi,
		} = this.props;
		const dispatch = this.store.dispatch;

		batch(() => {
			dispatch(setActivityTypes(webappApi));
			dispatch(setDefaultActivityType(webappApi));
			dispatch(setLanguages(webappApi.modelCollectionFactory.getCollection('language')));
			dispatch(setNotificationsLanguage(webappApi.userSelf.attributes.lang));
			dispatch(setExternalMeta({ ...meta, activityData }));

			if (activityId) {
				return dispatch(loadActivityById(Number(activityId)));
			}

			if (relatedModel) {
				return dispatch(setNewActivityRelatedModel(relatedModel));
			}

			/* eslint-disable-next-line */
			/* prettier-ignore */
			if (next || dealId || lead || project || personId || orgId || activityData) { // NOSONAR
				return this.prepopulateActivityFromParams();
			}

			return dispatch(loadActivityById(null));
		});
	}

	prepopulateActivityFromParams() {
		const { next, dealId, lead, project, personId, orgId, activityData } = this.props;

		this.store.dispatch(
			prepopulateActivityFromParams({
				next,
				dealId: toNumber(dealId),
				personId: toNumber(personId),
				orgId: toNumber(orgId),
				lead,
				project,
				...activityData,
			}),
		);
	}

	render() {
		const ActivityDialog = require('./components/activity-dialog').default;
		const {
			webappApi,
			translator,
			formFieldsTranslator,
			isFlowView,
			isContextualView,
			logger,
			onMounted,
			onSave,
		} = this.props;

		return (
			<ErrorBoundary
				error={<ErrorCard component="activities-modal" />}
				logger={logger}
				loggingData={{ facility: 'activities-modal' }}
			>
				<FormFieldsContext.Provider
					value={{
						translator: formFieldsTranslator,
						webappApi,
					}}
				>
					<ContextProvider
						value={{
							webappApi,
							translator,
							logger,
							isFlowView,
							isContextualView,
						}}
					>
						<Provider store={this.store}>
							<ActivityDialog
								closeModal={this.closeModal}
								autoFocus={!isContextualView}
								onMounted={onMounted}
								onSave={onSave}
							/>
						</Provider>
					</ContextProvider>
				</FormFieldsContext.Provider>
			</ErrorBoundary>
		);
	}
}

ActivitiesModal.propTypes = {
	webappApi: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	formFieldsTranslator: PropTypes.object.isRequired,
	activityId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	personId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	lead: PropTypes.object,
	project: PropTypes.object,
	dealId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	orgId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	meta: PropTypes.object,
	onsave: PropTypes.func,
	next: PropTypes.bool,
	onRender: PropTypes.func,
	isFlowView: PropTypes.bool,
	isContextualView: PropTypes.bool,
	relatedModel: PropTypes.object,
	hideFlowView: PropTypes.func,
	activityData: PropTypes.object,
	onClose: PropTypes.func,
	onAfterClose: PropTypes.func,
	onMounted: PropTypes.func,
	onSave: PropTypes.func,
	source: PropTypes.string,
};

export default withWebApiAndTranslatorLoader(ActivitiesModal, {
	componentName: 'activities-modal',
	includeFormFieldsTranslator: true,
	logStateOnError: true,
});
