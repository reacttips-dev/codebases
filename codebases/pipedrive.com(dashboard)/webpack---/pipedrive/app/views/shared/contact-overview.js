const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const moment = require('moment');
const BarChart = require('views/ui/bar-chart');
const Template = require('templates/shared/contact-overview.html');

module.exports = Pipedrive.View.extend({
	template: _.template(Template),

	initialize: function() {
		this.model.onChange('update_time add_time', this.render, this);

		this.initActivityTypesChart();
		this.initActivityUsersChart();

		this.render();
	},

	templateHelpers: function() {
		return {
			contactCreated: this.formatDate(this.model.get('add_time')),
			contactInactive: moment().diff(moment.utc(this.model.get('update_time')), 'days')
		};
	},

	afterRender: function() {
		this.attachTooltip();
	},

	attachTooltip: function() {
		if (this.$('.inactive').length) {
			this.$('.inactive').tooltip({
				tip: this.formatDate(this.model.get('update_time')),
				preDelay: 50,
				postDelay: 100,
				zIndex: 20000,
				fadeOutSpeed: 100,
				position: 'top-end'
			});
		}
	},

	formatDate: function(datetime) {
		return moment
			.utc(datetime, 'YYYY-MM-DD HH:mm:ss')
			.local()
			.format('LL');
	},

	initActivityTypesChart: function() {
		const totalActivities = this.model.additionalData.total_activities || {};
		const source = totalActivities.counts_by_type;

		if (!source || _.isEmpty(source)) {
			return;
		}

		const data = [];

		_.forEach(
			source,
			_.bind(function(count, type) {
				data.push({
					name: this.getLocalizedType(type),
					value: count
				});
			}, this)
		);

		data.sort(this.sortChartValues);

		this.groupExcessValues(data, 4);

		this.typesChart = new BarChart({
			title: _.gettext('Top activities'),
			data,
			className: 'orange'
		});

		this.addView('.typesChart', this.typesChart);
	},

	initActivityUsersChart: function() {
		const totalActivities = this.model.additionalData.total_activities || {};
		const source = totalActivities.counts_by_assignee;

		if (!source || _.isEmpty(source)) {
			return;
		}

		const data = [];

		_.forEach(source, function(values) {
			data.push({
				name: values.name,
				value: values.count
			});
		});

		data.sort(this.sortChartValues);

		this.groupExcessValues(data, 4);

		this.usersChart = new BarChart({
			title: _.gettext('Most active users'),
			data,
			className: 'blue'
		});

		this.addView('.usersChart', this.usersChart);
	},

	getLocalizedType: function(type) {
		// this only looks a bit hacky...
		const typeObj = _.find(User.get('activity_types'), { key_string: type });

		return typeObj ? typeObj.name : type;
	},

	sortChartValues: function(a, b) {
		return b.value - a.value;
	},

	groupExcessValues: function(data, length) {
		if (data.length > length) {
			const other = {
				name: _.gettext('Other'),
				value: 0
			};

			let i = length;

			for (i; i < data.length; i++) {
				other.value += data[i].value;
			}

			data.splice(length, data.length, other);
		}
	}
});
