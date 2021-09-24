export var ServiceWorkerNoSupportError = (function() {

	function ServiceWorkerNoSupportError() {
		var err = Error.call(this, 'ServiceWorker is not supported.');
		Object.setPrototypeOf(err, ServiceWorkerNoSupportError.prototype);
		return err;
	}

	ServiceWorkerNoSupportError.prototype = Object.create(Error.prototype);

	return ServiceWorkerNoSupportError;
})();

export var scriptUrl = __webpack_public_path__ + "serviceWorker.js";

export default function registerServiceWorkerIfSupported(mapScriptUrlOrOptions, maybeOptions) {

	var targetScriptUrl = scriptUrl;
	var options = maybeOptions;

	if (typeof mapScriptUrlOrOptions === 'function') {
		targetScriptUrl = mapScriptUrlOrOptions(targetScriptUrl);
	} else {
		options = mapScriptUrlOrOptions;
	}

	if ('serviceWorker' in navigator) {
		return navigator.serviceWorker.register(targetScriptUrl, options);
	}

	return Promise.reject(new ServiceWorkerNoSupportError());
}
