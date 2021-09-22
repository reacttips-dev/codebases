const _ = require('lodash');
const WebappApi = require('webapp-api/index');
const ReactDOM = require('react-dom');
const React = require('react');
const ServiceLoader = require('components/service-loader/index');
const relatedObjectsRules = {
	deal: [
		{ type: 'organization', relatedId: 'org_id' },
		{ type: 'person', relatedId: 'person_id' }
	],
	person: [{ type: 'organization', relatedId: 'org_id' }]
};

module.exports = ServiceLoader.extend({
	component: 'activities-components:activities-modal',
	serviceName: 'New activity modal',

	initialize: function(options) {
		this.options = options;

		ServiceLoader.prototype.initialize.apply(this, options);
	},

	getRelatedObjects() {
		const { relatedModel } = this.options;

		if (!relatedModel) {
			return null;
		}

		const { type, attributes, relatedObjects: relatedModels } = relatedModel;
		const relatedObjectsRule = relatedObjectsRules[type] || [];
		const relatedObjects = relatedObjectsRule.reduce(
			(result, rule) => {
				const relatedId = attributes[rule.relatedId];

				if (!relatedId) {
					return result;
				}

				const relatedObject = _.get(relatedModels, `${rule.type}.${relatedId}`);

				return {
					...result,
					[rule.type]: relatedObject || { id: relatedId }
				};
			},
			{ [type]: attributes }
		);

		const { person, deal, organization } = relatedObjects;

		return {
			participants: person ? [person] : [],
			deal,
			organization
		};
	},

	renderPage: function({ default: ActivityModal }, element) {
		ReactDOM.render(
			<ActivityModal
				webappApi={new WebappApi()}
				isFlowView
				onRender={this.options.onRender}
				relatedModel={this.getRelatedObjects()}
				hideFlowView={this.options.closeCompose}
			/>,
			element
		);
	},

	route: function(path) {
		this.servicePage.route(path);
	},

	getErrorMessage: function() {
		return _.gettext('Adding an activity is temporarily unavailable');
	},

	getMicroFEProps: function() {
		return {
			isFlowView: true,
			onRender: this.options.onRender,
			relatedModel: this.getRelatedObjects(),
			hideFlowView: this.options.closeCompose
		};
	}
});
