const GraphqlModel = require('./graphql');
const {
	getBillingDetails,
	toOldBillingDetails
} = require('client/graphql/queries/billing-details');

const BillingDetails = GraphqlModel.extend({
	ready: false,

	callbacks: null,

	graph: () => ({ query: getBillingDetails }),

	url: function() {
		return `${app.config.api}/billing/details?companyId=${app.global.company_id}`;
	},

	parse: function(response) {
		return toOldBillingDetails(response.data.billingDetails);
	},

	initialPull: function() {
		this.callbacks = [];

		this.pull({
			success: this.setAsReady.bind(this)
		});
	},

	setAsReady: function() {
		this.ready = true;

		this.callbacks.forEach((callback) => {
			callback();
		});
	},

	isReady: function() {
		return this.ready;
	},

	onReady: function(callback) {
		if (!this.isReady()) {
			this.callbacks.push(callback);

			return;
		}

		callback();
	}
});

module.exports = new BillingDetails();
