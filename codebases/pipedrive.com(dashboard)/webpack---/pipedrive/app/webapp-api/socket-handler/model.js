import _ from 'lodash';
import { Model } from '@pipedrive/webapp-core';
import Logger from '@pipedrive/logger-fe';
import { sendApplicationAction, parseMessage } from './socket-handler-utils';

const logger = new Logger('socket', 'handler');

const SocketHandler = Model.extend({
	initialize: function(data, { socket, user, modelCollectionFactory }) {
		this.source = socket;
		this.user = user;
		this.modelCollectionFactory = modelCollectionFactory;

		this.init();
	},

	init: function() {
		this.source.route('api.', (data) => {
			this.globalSyncUpdate(() => sendApplicationAction(data, this.modelCollectionFactory));

			const message = parseMessage(data);

			const messageObj = _.assignIn(
				{
					_meta: _.assignIn(data.meta, {
						routingKey: data.routingKey
					}),
					message: message || null,
					alert_type: data.routingKey.match(/^api\.([^.]+)\.([^.]+)/)[2],
					alert_action: data.routingKey.match(/^api\.([^.]+)\.([^.]+)/)[1],
					related_objects: data.related_objects
				},
				data.data
			);

			this.trigger('api.', messageObj);
		});

		this.source.route('state.', (data) => {
			logger.log('User state changed', data);

			let message = parseMessage(data);

			let button;

			if (message === '') {
				logger.log('No action for', data.routingKey, data.data);

				return false;
			}

			// Both message and button are provided
			if (_.isArray(message)) {
				button = message[1];
				message = message[0];
			}

			const messageObj = {
				_meta: _.assignIn(data.meta, {
					routingKey: data.routingKey
				}),
				message,
				reload: button,
				blocker: true,
				alert_type: 'state',
				alert_object: data.meta.object,
				alert_action: data.meta.action
			};

			this.trigger('state.', messageObj);
		});

		this.source.route('alert.', (data) => {
			logger.log('Got global alert notice', data);

			const messageObj = {
				_meta: _.assignIn(data.meta, {
					routingKey: data.routingKey
				}),
				message: parseMessage(data),
				alert_type: 'sticky'
			};

			this.trigger('alert.', messageObj);
		});

		this.source.route('global.system_event', (data) => {
			logger.log('Got global message', data);
			this.trigger('global.', data);
		});
	},

	/**
	 * Emits event with given parameters
	 *
	 * @param modelType ex. deal, activity, etc.
	 * @param action one of [added,updated,deleted]
	 * @param eventData
	 *
	 * where eventData should have a shape:
	 * eventData: {related_objects: {}, current: {}, previous: {}, meta:{}}
	 */
	notify: function(modelType, action, eventData) {
		const data = {
			routingKey: `api.${action}.${modelType}`,
			meta: {
				...eventData.meta,
				v: 1,
				id: eventData.current.id,
				action,
				object: modelType,
				company_id: this.user.get('company_id'),
				user_id: this.user.get('id')
			},
			data: {
				current: eventData.current,
				previous: eventData.previous
			},
			related_objects: eventData.related_objects
		};

		this.globalSyncUpdate(() => sendApplicationAction(data, this.modelCollectionFactory));

		const messageObj = _.assignIn(
			{
				_meta: _.assignIn(data.meta, {
					routingKey: data.routingKey
				}),
				message: parseMessage(data) || null,
				alert_type: modelType,
				alert_action: action,
				related_objects: data.related_objects
			},
			data.data
		);

		this.trigger('api.', messageObj);
	}
});

export default SocketHandler;
