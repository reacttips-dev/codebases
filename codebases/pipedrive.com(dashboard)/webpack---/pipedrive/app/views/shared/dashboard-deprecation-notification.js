const Pipedrive = require('pipedrive');
const _ = require('lodash');
const template = require('templates/shared/dashboard-deprecation-notification.html');

module.exports = Pipedrive.View.extend({
	template: _.template(template),

	onLoad: function() {
		this.render();
	},

	templateHelpers: function() {
		const highlightedTextStart = '<span style="font-weight: 600;">';
		const highlightedTextEnd = '</span>';

		const linkStart = '<a href="/progress/insights">';
		const linkEnd = '</a>';

		const deprecationText = _.gettext(
			'This feature will be %sreplaced this month%s by Insights – new custom visual report builder. %s%s%s',
			[
				highlightedTextStart,
				highlightedTextEnd,
				linkStart,
				_.gettext('Go to Insights'),
				linkEnd
			]
		);

		return {
			deprecationText
		};
	}
});
