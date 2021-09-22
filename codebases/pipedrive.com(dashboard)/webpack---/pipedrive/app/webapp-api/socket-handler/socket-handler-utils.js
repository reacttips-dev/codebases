import _ from 'lodash';
import Logger from '@pipedrive/logger-fe';

import User from 'models/user';
import convertToLocalDateTime from 'utils/convert-to-local-date-time';

const logger = new Logger('socket', 'handler');
const { format } = require('utils/formatter');

const allowedModelTypes = [
	'activity',
	'customfield',
	'dealField',
	'organizationField',
	'personField',
	'productField',
	'currency',
	'deal',
	'mailMessage',
	'mailQueueItem',
	'mailThread',
	'mailParty',
	'mailConnection',
	'mailTracking',
	'note',
	'filter',
	'goal',
	'organization',
	'person',
	'product',
	'socket',
	'story',
	'user',
	'userCounts',
	'userSetting',
	'userProfile',
	'participant',
	'dealFollower',
	'personFollower',
	'organizationFollower',
	'organizationRelation',
	'export',
	'file',
	'invoice',
	'document'
];

function escapeReplacements(replacements) {
	return Array.isArray(replacements) && replacements.map(_.escape);
}

const messages = {
	'api.added.deal': function(current) {
		return _.gettext(
			'Added new deal ‘%1$s’ worth %2$s',
			escapeReplacements([current.title, format(current.value, current.currency)])
		);
	},
	'api.added.activity': function(current) {
		const convertedDateTime = convertToLocalDateTime(current.due_date, current.due_time);
		const dueDate = convertedDateTime.format('L');
		const dueTime = convertedDateTime.noTime ? null : convertedDateTime.format('LT');

		if (convertedDateTime.noTime) {
			return _.gettext('%1$s added for %2$s', escapeReplacements([current.subject, dueDate]));
		} else {
			return _.gettext(
				'%1$s added for %2$s at %3$s',
				escapeReplacements([current.subject, dueDate, dueTime])
			);
		}
	},
	'api.added.filter': function(current) {
		return _.gettext('New filter ‘%s’ added', escapeReplacements([current.name]));
	},
	'api.added.person': function(current) {
		return _.gettext('New person ‘%s’ added', escapeReplacements([current.name]));
	},
	'api.added.organization': function(current) {
		return _.gettext('New organization ‘%s’ added', escapeReplacements([current.name]));
	},
	'api.added.product': function(current) {
		return _.gettext('New product ‘%s’ added', escapeReplacements([current.name]));
	},
	'api.added.group': function() {
		return _.gettext('New group was added');
	},
	'api.updated.group': function() {
		return _.gettext('Group has been updated');
	},
	'api.added.note': function() {
		return _.gettext('New note was added');
	},
	'api.updated.deal': function(current, previous) {
		if (current.stage_id === previous.stage_id) {
			const title = current.title || previous.title;

			if (current.status) {
				const status = current.status === 'delete' ? _.gettext('deleted') : current.status;

				return _.gettext(
					'Deal ‘%1$s’ has been updated (deal %2$s)',
					escapeReplacements([title, status])
				);
			} else {
				return _.gettext('Deal ‘%s’ has been updated', escapeReplacements([title]));
			}
		} else {
			return messages['api.updated.deal.stage'](current, previous);
		}
	},
	'api.updated.deal.stage': function(current, previous) {
		return _.gettext(
			'Deal ‘%s’ has been moved to another stage',
			escapeReplacements([current.title || previous.title])
		);
	},
	'api.updated.filter': function(current, previous) {
		return _.gettext(
			'Filter ‘%s’ has been updated',
			escapeReplacements([current.name || previous.name])
		);
	},
	'api.updated.activity': function(current, previous) {
		return _.gettext(
			'Activity ‘%s’ has been updated',
			escapeReplacements([current.subject || previous.subject])
		);
	},
	'api.updated.person': function(current, previous) {
		return _.gettext(
			'Person ‘%s’ has been updated',
			escapeReplacements([current.name || previous.name])
		);
	},
	'api.updated.organization': function(current, previous) {
		return _.gettext(
			'Organization ‘%s’ has been updated',
			escapeReplacements([current.name || previous.name])
		);
	},
	'api.updated.note': function() {
		return _.gettext('Note was updated');
	},
	'api.deleted.deal': function(current, previous) {
		return _.gettext('Deal ‘%s’ has been deleted', escapeReplacements([previous.title]));
	},
	'api.deleted.activity': function(current, previous) {
		return _.gettext('Activity ‘%s’ has been deleted', escapeReplacements([previous.subject]));
	},
	'api.deleted.filter': function(current, previous) {
		return _.gettext('Filter ‘%s’ has been deleted', escapeReplacements([previous.name]));
	},
	'api.deleted.person': function(current, previous) {
		return _.gettext('Person ‘%s’ has been deleted', escapeReplacements([previous.name]));
	},
	'api.deleted.organization': function(current, previous) {
		return _.gettext('Organization ‘%s’ has been deleted', escapeReplacements([previous.name]));
	},
	'api.content_changed.group': function() {
		return _.gettext('Group content has been changed');
	},
	'api.deleted.note': function() {
		return _.gettext('Note has been deleted');
	},
	'api.updated.mailParty': function() {
		return _.gettext('Mail party has been updated');
	},

	// Alert messages
	'alert.updated.git': function(data) {
		const modules = `‘<b>${data.modules.join('</b>’, ‘<b>')}</b>’`;

		return [
			_.gettext('There is a new version of application available. <br /> Updated: %s', [
				modules
			]),
			_.gettext('Reload')
		];
	}
};

const handlers = {
	// Settings are only updated for current user.
	// settings are synced one-by-one via socketqueue,
	// thus need to be handled as keys of settings model.
	userSetting: function(data) {
		let model;

		// If incoming socketqueue event is 'settings'
		// but doesn’t belong to the user, no update is fired
		if (data.meta.user_id === User.id) {
			model = User.settings;
			model.set(data.meta.id, data.data.current);
		}

		return model;
	},
	// counts are stored with the User model internally, thus need to be routed through User.counts not directly
	userCounts: function(data) {
		let model;

		if (data.meta.id === User.id) {
			model = User.counts;
			model.set(data.data.current);
		}

		return model;
	},
	userProfile: function(data) {
		let model;

		if (data.meta.id === User.id) {
			model = User.profile;
			model.set(data.data.current);
		}

		return model;
	},
	user: function(data, modelType) {
		let model;

		if (data.meta.id === User.id) {
			model = User;
			model.set(data.data.current);
		} else {
			// For some reason the added event comes as an array. Need this hack or change BE :(
			model = handlers.defaults(
				{
					...data,
					data: {
						current: {
							...data.data.current[0]
						},
						previous: null
					}
				},
				modelType
			);
		}

		return model;
	},
	dealField: function(data, modelType, modelCollectionFactory) {
		return modelCollectionFactory.getModel('field', data.data.current, { type: 'deal' });
	},
	personField: function(data, modelType, modelCollectionFactory) {
		return modelCollectionFactory.getModel('field', data.data.current, {
			type: 'person'
		});
	},
	organizationField: function(data, modelType, modelCollectionFactory) {
		return modelCollectionFactory.getModel('field', data.data.current, {
			type: 'organization'
		});
	},
	productField: function(data, modelType, modelCollectionFactory) {
		return modelCollectionFactory.getModel('field', data.data.current, {
			type: 'product'
		});
	},
	socket: function() {
		return;
	},
	defaults: function(data, modelType, modelCollectionFactory) {
		const model = modelCollectionFactory.getModel(modelType, data.data.current);

		model.previous = data.data.previous;

		return model;
	}
};

const getModel = async function(modelType, data, modelCollectionFactory) {
	let handler = modelType;

	if (!handlers.hasOwnProperty(handler)) {
		handler = 'defaults';
	}

	const model = await handlers[handler](data, modelType, modelCollectionFactory);

	// Preventing memory leak by cleaning up global event listeners
	model.unbindAllSocketEvents();

	model.meta = data.meta;

	if (data.related_objects) {
		model.relatedObjects = model.relatedObjects || {};
		_.assignIn(model.relatedObjects, data.related_objects);
	}

	return model;
};

export const parseMessage = function(data) {
	const type = data.routingKey.match(/^(api|alert|state)\.([^.]+)\.([^.]+)/);

	if (type) {
		const messageFunc = messages[type[0]];

		if (messageFunc) {
			return messageFunc(data.data.current, data.data.previous);
		}
	}

	return '';
};

/**
 * Puts data from the sockets into the right type of model and sends it out via global event fire
 * or just fires a delete event.
 * @param  {Object} data			Data from the backend through sockets
 * @void
 */

export const sendApplicationAction = async function(data, modelCollectionFactory) {
	try {
		const keywordMap = {
			added: 'add',
			updated: 'update',
			deleted: 'delete'
		};
		const keyword = data.routingKey.split('.');
		const modelType = keyword[2];
		const globalEventKey = `${modelType}.model.${data.meta.id}.${keywordMap[keyword[1]]}`;

		let model;

		if (_.includes(allowedModelTypes, modelType)) {
			model = await getModel(modelType, data, modelCollectionFactory);
		}

		if (keyword[1] === 'deleted') {
			app.global.fire(globalEventKey, data.meta.id, model);
		} else if (model) {
			app.global.fire(globalEventKey, model);

			if ('unload' in model) {
				model.unload();
			}
		}
	} catch (e) {
		logger.logError(e, 'Sending global event failed');
	}
};
