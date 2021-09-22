const ServiceLoader = require('components/service-loader/index');
const WebappApi = require('webapp-api/index');
const _ = require('lodash');
const Template = require('./index.html');

module.exports = ServiceLoader.extend({
	component: 'email-components:composer-header',
	serviceName: 'email-components-composer-header',
	template: _.template(Template),

	initialize: function(options) {
		this.options = options || {};
		this.saveDraft = options.saveDraft;
		this.draftModel = options.draftModel;
		this.onFocus = options.onFocus;
		this.onSubjectBlur = options.onBlur;
		this.subjectValue = options.subjectValue;
		this.placeholder = options.placeholder;

		ServiceLoader.prototype.initialize.call(this, options);
	},

	renderPage: function(ServicePage, element) {
		this.servicePage = new ServicePage({
			headerEl: element,
			api: new WebappApi(),
			viewPath: window.location.pathname,
			onFocus: this.onFocus,
			onBlur: this.onSubjectBlur,
			placeholder: this.placeholder,
			subjectValue: this.subjectValue
		});

		this.subjectEditor = this.servicePage.subjectEditor;

		app.router.on('route', () => {
			const newPath = window.location.pathname;

			this.servicePage.route(newPath);
		});
	},

	getErrorMessage: function() {
		return _.gettext('Composer templates module temporarily unavailable');
	}
});
