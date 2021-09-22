const ReactDOM = require('react-dom');
const React = require('react');
const _ = require('lodash');
const ServiceLoader = require('components/service-loader/index');
const WebappApi = require('webapp-api/index');

export default ServiceLoader.extend({
	serviceName: 'New activity modal',
	component: 'activities-components:activities-modal',

	initialize: function(params) {
		const {
			activity,
			next,
			deal,
			lead,
			project,
			person,
			organization,
			org,
			data,
			meta,
			onsave,
			onClose,
			onAfterClose,
			onMounted,
			onSave,
			// eslint-disable-next-line camelcase
			metrics_data
		} = params;

		this.modalParams = {
			activityId: _.get(activity, 'attributes.id', activity),
			dealId: _.get(deal, 'attributes.id', deal),
			lead,
			project,
			personId: _.get(person, 'attributes.id', person),
			orgId: org
				? _.get(org, 'attributes.id', org)
				: _.get(organization, 'attributes.id', organization),
			activityData: data,
			meta,
			onsave,
			next,
			onClose,
			onAfterClose,
			onMounted,
			onSave,
			// eslint-disable-next-line camelcase
			source: metrics_data && metrics_data.source
		};
		this.modalContainer = params.container || document.getElementById('modal-container');
		ServiceLoader.prototype.initialize.apply(this);
	},

	renderPage: function({ default: ActivityModal }) {
		ReactDOM.render(
			<ActivityModal webappApi={new WebappApi()} {...this.modalParams} />,
			this.modalContainer
		);
	},

	close: function() {
		// This will close the modal without animation but this is a temporary fix anyways
		ReactDOM.unmountComponentAtNode(this.modalContainer);
	},

	getMicroFEProps: function() {
		return this.modalParams;
	}
});
