import browser from 'utils/browser';
import _ from 'lodash';
const ContextDataBuilder = function ContextDataBuilder() {
	this.data = {};
};
const errorUtils = {};

_.assignIn(ContextDataBuilder.prototype, {
	browser: function() {
		const isSupportedBrowser = browser.isSupportedBrowser();

		this.data.browser = String(browser.getUserWebBrowser());
		this.data.browser_version = String(browser.getUserWebBrowserVersion());
		this.data.browser_is_supported = String(isSupportedBrowser);

		return this;
	},
	url: function() {
		this.data.url = document.location.toString();

		return this;
	},
	language: function() {
		if (navigator && navigator.language) {
			this.data.language = navigator.language;
		}

		return this;
	},
	platform: function() {
		if (navigator && navigator.platform) {
			this.data.platform = navigator.platform;
		}

		return this;
	},
	userAgent: function() {
		if (navigator && navigator.userAgent) {
			this.data.userAgent = navigator.userAgent;
		}

		return this;
	},
	windowKeys: function() {
		if (window && _ && _.keys) {
			this.data.windowKeys = _.keys(window);
		}

		return this;
	},
	appVersion: function() {
		if (app && app.config && app.config.version) {
			this.data.appVersion = app.config.version;
		}

		return this;
	},
	build: function() {
		return this.data;
	}
});

errorUtils.toPlainObject = function(error) {
	const contextData = errorUtils.contextData();

	return _.assignIn(contextData, {
		message: error.toString() || '',
		file: error.fileName || '',
		line: error.lineNumber || '',
		col: error.columnNumber || '',
		stack: error.stack || ''
	});
};

errorUtils.contextData = function() {
	const dataBuilder = new ContextDataBuilder();

	return dataBuilder
		.browser()
		.url()
		.language()
		.platform()
		.userAgent()
		.windowKeys()
		.appVersion()
		.build();
};

export default errorUtils;
