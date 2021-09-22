const ReactDOM = require('react-dom');
const ServiceLoader = require('components/service-loader');
const WebappApi = require('webapp-api');
const snackbars = require('snackbars');

const getModalType = (contentId) => {
	if (contentId.startsWith('deal/add')) {
		return 'deal';
	}

	if (contentId.startsWith('organization/add')) {
		return 'organization';
	}

	if (contentId.startsWith('person/add')) {
		return 'person';
	}
};

export default ServiceLoader.extend({
	serviceName: 'Add modals',
	component: 'add-modals',

	initialize: function(contentId, params) {
		this.params = params;
		this.params.modalType = getModalType(contentId);
		this.modalContainer = params.container || document.getElementById('modal-container');

		ServiceLoader.prototype.initialize.apply(this);
	},

	renderPage(ServicePage) {
		this.servicePage = new ServicePage({
			el: this.modalContainer,
			api: new WebappApi(),
			params: this.params,
			snackbars
		});
	},

	close: function() {
		// This will close the modal without animation but this is a temporary fix anyways
		ReactDOM.unmountComponentAtNode(this.modalContainer);
	}
});
