function getUserWebBrowser(key) {
	// eslint-disable-next-line complexity
	const getBrowser = function() {
		switch (navigator.appName) {
			case 'Opera':
				return 'opera';
			case 'Microsoft Internet Explorer':
				return 'msie';
			case 'Netscape': {
				const re = new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})');

				if (re.exec(navigator.userAgent) !== null) {
					return 'msie';
				}
			}
			/* falls through */
			default:
				if (navigator.vendor.match(/Google Inc./i) !== null) {
					return 'chrome';
				} else if (navigator.vendor.match(/Apple Computer, Inc./i) !== null) {
					if (navigator.userAgent.match(/iPad/i) !== null) {
						return 'ipad';
					} else if (navigator.userAgent.match(/iPhone/i) !== null) {
						return 'iphone';
					}

					return 'safari';
				} else if (navigator.userAgent.indexOf('Firefox') !== -1) {
					return 'firefox';
				} else if (navigator.userAgent.indexOf('Edge') !== -1) {
					return 'edge';
				}
		}

		return 'unknown';
	};

	if (typeof key === 'string') {
		return getBrowser() === key;
	} else {
		return getBrowser();
	}
}

function getUserDeviceType(key) {
	let deviceType = 'desktop';

	if (navigator.userAgent.match(/mobile/i) !== null) {
		deviceType = 'mobile';
	} else if (navigator.userAgent.match(/tablet/i) !== null) {
		deviceType = 'tablet';
	} else if (navigator.userAgent.match(/ipad/i) !== null) {
		deviceType = 'tablet';
	} else if (navigator.userAgent.match(/iphone/i) !== null) {
		deviceType = 'mobile';
	} else if (navigator.userAgent.match(/ipod/i) !== null) {
		deviceType = 'mobile';
	}

	if (typeof key === 'string') {
		return deviceType === key;
	} else {
		return deviceType;
	}
}

function getUserWebBrowserVersion() {
	if (getUserWebBrowser('unknown')) {
		return 0;
	}

	const reExec = new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent);

	if (getUserWebBrowser('msie') && reExec !== null && reExec[1] && reExec[1].split('.')[0]) {
		return parseInt(reExec[1].split('.')[0], 10);
	}

	const searchString = {
		chrome: 'Chrome',
		safari: 'Version',
		ipad: 'Version',
		iphone: 'Version',
		opera: 'Version',
		firefox: 'Firefox',
		msie: 'MSIE',
		edge: 'Edge'
	};
	const browserString = getUserWebBrowser();

	return parseFloat(
		navigator.userAgent.substring(
			navigator.userAgent.indexOf(searchString[browserString]) +
				searchString[browserString].length +
				1
		)
	);
}

function getUserOperatingSystem(key) {
	let os = 'unknown';

	if (navigator.appVersion.indexOf('Windows Phone') !== -1) {
		os = 'windowsphone';
	} else if (navigator.appVersion.indexOf('Win') !== -1) {
		os = 'windows';
	} else if (navigator.appVersion.indexOf('Android') !== -1) {
		os = 'android';
	} else if (navigator.appVersion.indexOf('Mac') !== -1) {
		os = 'macosx';
	} else if (navigator.appVersion.indexOf('X11') !== -1) {
		os = 'unix';
	} else if (navigator.appVersion.indexOf('Linux') !== -1) {
		os = 'linux';
	}

	if (typeof key === 'string') {
		return os === key;
	} else {
		return os;
	}
}

function isSupportedBrowser() {
	return app.supportedBrowser;
}

module.exports = {
	getUserWebBrowser,
	getUserDeviceType,
	getUserWebBrowserVersion,
	getUserOperatingSystem,
	isSupportedBrowser
};
