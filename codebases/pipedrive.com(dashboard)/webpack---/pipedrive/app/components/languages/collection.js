const LanguageModel = require('models/language');
const GraphqlCollection = require('collections/graphql');
const { getLanguages } = require('client/graphql/queries/languages.gql');

module.exports = GraphqlCollection.extend({
	model: LanguageModel,
	graph: () => ({ query: getLanguages }),
	url: function() {
		return `${app.config.api}/languages`;
	},

	pendingCallbacks: [],
	fetching: false,
	done: false,

	parse: function(response) {
		return response.data.languages;
	},

	ready: function(callback) {
		if (this.fetching) {
			this.pendingCallbacks.push({ callback });
		} else if (this.done) {
			return callback(this);
		} else {
			this.fetching = true;
			this.pendingCallbacks.push({ callback });

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
	}
});
