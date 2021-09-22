/* eslint-disable */
__webpack_public_path__ = 'https://cdn.' + app.config.cdnDomain + '/activities-components/'; // NOSONAR

if (!Element.prototype.matches)
	Element.prototype.matches =
		Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		let el = this;

		if (!document.documentElement.contains(el)) return null;

		do {
			if (el.matches(s)) return el;

			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);

		return null;
	};
}
