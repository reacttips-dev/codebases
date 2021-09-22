const { Model } = require('@pipedrive/webapp-core');
const GraphqlCollection = require('collections/graphql');
const { getCompanyUsers, toOldCompanyUsers } = require('client/graphql/queries/company');

const UserModel = Model.extend({
	type: 'user',
	fallback: {
		icon_url: `${app.config.static}/images/icons/profile_120x120.svg`
	}
});

module.exports = GraphqlCollection.extend({
	model: UserModel,
	url: '/api/v1/users',
	graph: () => ({ query: getCompanyUsers }),

	additionalData: {
		mySuites: []
	},
	pendingCallbacks: [],
	done: false,

	parse: function(response) {
		const users = this._getUsers(response);
		const mySuitesUsers = this._getMySuitesUsers(users);

		const getUsersBySuites = (suites) => this._getUsersBySuites(mySuitesUsers, suites);

		response.getUsersBySuites = getUsersBySuites;
		this.getUsersBySuites = getUsersBySuites;

		return mySuitesUsers;
	},

	ready: function(callback, errorCallback) {
		if (this.fetching) {
			this.pendingCallbacks.push({ callback, error: errorCallback });
		} else if (this.done) {
			return callback(this);
		} else {
			this.fetching = true;
			this.pendingCallbacks.push({ callback, error: errorCallback });

			this.pull({
				success: (m) => {
					this.fetching = false;
					this.done = true;

					if (this.pendingCallbacks.length) {
						for (let i = 0; i < this.pendingCallbacks.length; i++) {
							this.pendingCallbacks[i].callback(m);
						}
						this.pendingCallbacks = [];
					}
				}
			});
		}
	},

	getUserById: function(id) {
		return this.find({ id: parseInt(id, 10) });
	},

	_getUsers: function(response) {
		this.additionalData.company_id = parseInt(response.data.company.id, 10);

		return toOldCompanyUsers(response.data);
	},

	_getMySuitesUsers: function(users) {
		const mySuites = users.find((user) => user.is_you)?.suites;

		if (!mySuites) {
			return [];
		}

		this.additionalData.mySuites = mySuites;

		return users.filter((user) => {
			if (user.is_you) {
				return true;
			}

			return user.suites.some((suite) => mySuites.includes(suite));
		});
	},

	_getUsersBySuites: function(mySuitesUsers, suites) {
		return mySuitesUsers.filter((user) => {
			return user.suites.some((suite) => suites.includes(suite));
		});
	}
});
