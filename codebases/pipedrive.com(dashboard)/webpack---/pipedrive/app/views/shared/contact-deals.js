const Pipedrive = require('pipedrive');
const _ = require('lodash');
const BarChart = require('views/ui/bar-chart');
const Template = require('templates/shared/contact-deals.html');
const DealTiles = require('../../components/deal-tiles/index');
const { get } = require('@pipedrive/fetch');
const modals = require('utils/modals');

module.exports = Pipedrive.View.extend({
	template: _.template(Template),

	initialize: function(options) {
		this.options = options || {};
		this.customView = this.options.customView;
		// We keep track of whether the page is active or not.
		// If it is active we will listen to model changes and re-fetch open deals
		// If it is not active we will ignore model changes, but perform a re-fetch when page is re-opened
		this.isActive = true;

		// Make sure we fetch initial data
		this.refetchOnFocus = true;

		this.dealTileProps = {
			includeStageSelector: true,
			onActivitySaved: async () => {
				const { openDeals } = await this.fetchDealsData({ includeSummary: false });

				this.renderOpenDealTiles(openDeals);
			},
			onActivityMarkedAsDone: async () => {
				const { openDeals } = await this.fetchDealsData({ includeSummary: false });

				this.renderOpenDealTiles(openDeals);
			}
		};

		this.model.on(
			'change:participant_open_deals_count change:participant_closed_deals_count ' +
				'change:open_deals_count change:closed_deals_count',
			_.debounce(async () => {
				if (!this.isActive) {
					this.refetchOnFocus = true;

					return;
				}

				const { openDeals, summaryPerStatusPerCurrency } = await this.fetchDealsData();

				this.render();
				this.renderValueChart(summaryPerStatusPerCurrency);
				this.renderOpenDealTiles(openDeals);
			}, 250)
		);
	},

	onLoad: function() {
		this.render();
	},

	onFocus: async function() {
		this.isActive = true;

		if (this.refetchOnFocus) {
			const { openDeals, summaryPerStatusPerCurrency } = await this.fetchDealsData();

			this.render();
			this.renderValueChart(summaryPerStatusPerCurrency);
			this.renderOpenDealTiles(openDeals);

			this.refetchOnFocus = false;
		}
	},

	onBlur: function() {
		this.isActive = false;
	},

	onDestroy: function() {
		if (this.dealTilesView && this.dealTilesView.onDestroy) {
			this.dealTilesView.onDestroy();
		}
	},

	fetchDealsData: async function({ includeSummary = true } = {}) {
		const type = `${this.model.type}s`;
		const id = this.model.get('id');

		try {
			const {
				data: openDeals,
				additional_data: { summary_per_status_per_currency: summaryPerStatusPerCurrency }
			} = await get(
				`/api/v1/${type}/${id}/deals?status=open&only_primary_association=1&sort=expected_close_date+ASC%2C+add_time+ASC&limit=5&${
					includeSummary ? 'get_summary=true' : ''
				}`
			);

			return {
				openDeals: openDeals || [],
				summaryPerStatusPerCurrency: summaryPerStatusPerCurrency || {}
			};
		} catch (err) {
			return {
				openDeals: [],
				summaryPerStatusPerCurrency: {}
			};
		}
	},

	renderOpenDealTiles: function(openDeals) {
		if (openDeals.length === 0) {
			return;
		}

		const el = this.$('.openDeals').get(0);

		if (!this.dealTilesView) {
			this.dealTilesView = new DealTiles({
				el,
				deals: openDeals,
				dealTileProps: this.dealTileProps
			});

			return;
		}

		this.dealTilesView.renderDealTiles(el, openDeals, this.dealTileProps);
	},

	renderValueChart: function(summaryPerStatusPerCurrency) {
		if (!summaryPerStatusPerCurrency.won || !summaryPerStatusPerCurrency.lost) {
			return;
		}

		const won = summaryPerStatusPerCurrency.won.total_converted;
		const lost = summaryPerStatusPerCurrency.lost.total_converted;
		const closedCount = won.count + lost.count;

		if (!won.count && !lost.count) {
			return;
		}

		const data = [
			{
				name: _.gettext('Won'),
				value: won.count,
				className: 'won',
				valueFormatted: won.value_formatted
			},
			{
				name: _.gettext('Lost'),
				value: lost.count,
				className: 'lost',
				valueFormatted: lost.value_formatted
			}
		];

		this.valueChart = new BarChart({
			title: _.gettext('Closed deals'),
			count: closedCount,
			data,
			className: 'closedDealsChart',
			legendRow: function(row) {
				return [row.name, row.value, `${Math.round(row.percentage)}%`, row.valueFormatted];
			}
		});

		this.addView('.valueChart', this.valueChart);
	},

	templateHelpers: function() {
		const personAsParticipantInOpenDeals = this.model.get('participant_open_deals_count');
		const personAsParticipantInClosedDeals = this.model.get('participant_closed_deals_count');
		const relatedOpenDealsCount = this.model.get('related_open_deals_count');
		const relatedClosedDealsCount = this.model.get('related_closed_deals_count');

		return {
			model: this.model,
			openDealsCount: this.model.get('open_deals_count'),
			dealCounts: [
				{
					title: _.gettext('Related Deals'),
					count: relatedOpenDealsCount + relatedClosedDealsCount,
					text: this.getDealsCountsTexts(relatedOpenDealsCount, relatedClosedDealsCount)
				},
				{
					title: _.gettext('Participant'),
					count: personAsParticipantInOpenDeals + personAsParticipantInClosedDeals,
					text: this.getDealsCountsTexts(
						personAsParticipantInOpenDeals,
						personAsParticipantInClosedDeals
					)
				}
			]
		};
	},

	getDealsCountsTexts: function(openDeals, closedDeals) {
		const dealsCountsTexts = [];

		if (openDeals) {
			dealsCountsTexts.push(
				_.ngettext('%d open deal', '%d open deals', openDeals, openDeals)
			);
		}

		if (closedDeals) {
			dealsCountsTexts.push(
				_.ngettext('%d closed deal', '%d closed deals', closedDeals, closedDeals)
			);
		}

		return dealsCountsTexts.join(' · ');
	},

	afterRender: function() {
		this.$('.addNew').on(
			'click',
			_.bind(function(ev) {
				ev.preventDefault();

				const params = {
					// Old API
					prefill_org: this.model.type === 'organization' ? this.model : null,
					prefill_person: this.model.type === 'person' ? this.model : null,
					// New API
					prefill: {
						person_id:
							this.model.type === 'person'
								? {
										id: this.model.get('id'),
										name: this.model.get('name')
								  }
								: null,
						org_id:
							this.model.type === 'organization'
								? {
										id: this.model.get('id'),
										name: this.model.get('name')
								  }
								: this.model.get('org_id') // In case a person has a linked organization
								? {
										id: this.model.get('org_id'),
										name: this.model.get('org_name')
								  }
								: null
					}
				};

				modals.open('webapp:modal', {
					modal: 'deal/add',
					params
				});
			}, this)
		);

		this.$('.viewDeals').on(
			'click',
			_.bind(function(ev) {
				ev.preventDefault();

				modals.open('webapp:modal', {
					modal: 'deals-v2',
					params: {
						model: this.model,
						customView: this.customView
					}
				});
			}, this)
		);
	}
});
