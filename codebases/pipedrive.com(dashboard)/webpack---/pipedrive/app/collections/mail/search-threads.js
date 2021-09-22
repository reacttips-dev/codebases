const ThreadsCollection = require('./threads');
const _ = require('lodash');

module.exports = ThreadsCollection.extend({
	section: 'search',

	_lastSearchKeyword: null,
	_partyData: null,
	metricsKeywordLength: null,

	pullLimit: 100,

	pullFirstPage: function() {
		// We pull search list only via method searchByKeyword.
		return;
	},

	searchByKeyword: function(opts) {
		this.setPartyData(null);
		this.resetSelection();

		this.setSearchKeyword(opts.data.keyword);

		opts.data = _.assignIn({}, opts.data, this.getActiveFilters());
		opts.reset = true;

		this.trigger('search:started');
		this.pullPage(opts);
	},

	searchByPartyId: function(opts) {
		this.setSearchKeyword(null);
		this.resetSelection();

		this.setPartyData({ partyId: opts.data.mail_party_id });

		opts.data = _.assignIn({}, opts.data, this.getActiveFilters());
		opts.reset = true;

		this.trigger('search:started');
		this.pullPage(opts);
	},

	pullPage: function(opts) {
		if (opts.data.keyword) {
			opts.data.search = opts.data.keyword;
			delete opts.data.keyword;
		}

		ThreadsCollection.prototype.pullPage.call(this, opts);
	},

	parse: function(response) {
		const partyData = response.additional_data && response.additional_data.party_data;
		const partyNameEmail = partyData ? this.combinePartyNameEmailString(partyData) : null;

		if (partyNameEmail) {
			this.setPartyData({ partyNameEmail });
		}

		// eslint-disable-next-line prefer-rest-params
		return ThreadsCollection.prototype.parse.apply(this, arguments);
	},

	getPullBy: function() {
		const partyId = this.getPartyData('partyId');
		const keyword = this.getSearchKeyword();
		const pullBy = {};

		if (keyword) {
			pullBy.search = keyword;
		}

		if (partyId) {
			pullBy.mail_party_id = partyId;
		}

		return pullBy;
	},

	isSameLastKeyword: function(keyword) {
		return keyword === this.getSearchKeyword();
	},

	getLastSearchData: function() {
		return this.getPullBy();
	},

	setSearchKeyword: function(keyword) {
		this._lastSearchKeyword = keyword || null;
	},

	getSearchKeyword: function() {
		return this._lastSearchKeyword;
	},

	setPartyData: function(data) {
		this._partyData = data ? _.assignIn(this._partyData, data) : null;
	},

	getPartyData: function(key) {
		return key ? _.get(this._partyData, key) : this._partyData;
	},

	combinePartyNameEmailString: function(partyData) {
		const name = partyData.linked_person_name || partyData.name;
		const email = partyData.email_address;

		let string;

		if (name && email) {
			string = `${name} (${email})`;
		} else {
			string = email ? email : name;
		}

		return string;
	}
});
