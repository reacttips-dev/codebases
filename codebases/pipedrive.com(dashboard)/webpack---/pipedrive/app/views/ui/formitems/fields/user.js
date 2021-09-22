const Company = require('collections/company');
const _ = require('lodash');
const User = require('models/user');
const selectField = require('./select');

const getCompanyUsers = function(opts) {
	const users = [];

	_.forEach(Company.where({ active_flag: true }), function(user) {
		if (opts.allowedUsers && !_.includes(opts.allowedUsers, user.id)) {
			return;
		}

		if (opts.item_type === 'activity' && !user.get('verified')) {
			return;
		}

		users.push(user);
	});

	return users;
};

function getInActiveUserOption(userId) {
	const user = Company.getUserById(userId);

	return {
		id: userId,
		label: user
			? `${user.get('name')} (${_.gettext('deactivated')})`
			: `(${_.gettext('hidden user')})`,
		selected: true
	};
}

function getUserOption(user, opts) {
	const userId = user.get('id');
	const userName = user.get('name');

	return {
		id: userId,
		label: User.id === userId ? `${userName} (${_.gettext('you')})` : userName,
		selected: opts.user ? opts.user === userId : false
	};
}

/**
 * Decides whether empty value should be added to select list options.
 * Mandatory fields are user_id, owner_id and assigned_to_user_id.
 * @param Object opts field options
 * @return Boolean
 */
function addEmptyValue(opts) {
	return opts.emptyValue || !_.includes(['user_id', 'owner_id', 'assigned_to_user_id'], opts.key);
}

/**
 * Returns user id from field settings if set
 * @param  Object opts field settings
 * @return Number
 */
function getUserId(opts) {
	return !opts.user && opts.value && opts.value.user ? opts.value.user : opts.user;
}

function getUserOptions(opts, users) {
	const options = [];

	if (addEmptyValue(opts)) {
		options.push({ id: '' });
	}

	_.forEach(opts.prependOptions, function(prependOption) {
		options.push(prependOption);
	});

	_.forEach(users, function(user) {
		options.push(getUserOption(user, opts));
	});

	/**
	 * Additional case, where user that should be displayed
	 * in the options is already disabled. In this case we
	 * should show the user in the list and when owner is
	 * changed, then it will be removed.
	 */
	if (opts.user && !_.some(options, { id: Number(opts.user) })) {
		options.push(getInActiveUserOption(opts.user));
	}

	return options;
}

module.exports = function(opts) {
	const users = getCompanyUsers(opts);

	opts.user = getUserId(opts);
	opts.defaultValue = opts.user || '';

	opts.options = getUserOptions(opts, users);

	if (opts.disableOnSingleOption && users.length <= 1) {
		opts.disabled = true;
	}

	return selectField(opts);
};
