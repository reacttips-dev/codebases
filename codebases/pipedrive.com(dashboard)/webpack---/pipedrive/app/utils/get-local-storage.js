'use strict';

let localStorageSupported;

try {
	const key = '_pd_localStorageTest';

	localStorage.setItem(key, key);
	localStorage.removeItem(key);

	localStorageSupported = true;
} catch (e) {
	localStorageSupported = false;
}

module.exports = {
	getItem: function getItem(key) {
		if (localStorageSupported) {
			return localStorage.getItem(key);
		}
	},
	setItem: function setItem(key, value) {
		if (localStorageSupported) {
			localStorage.setItem(key, value);
		}
	},
	localStorageSupported
};
