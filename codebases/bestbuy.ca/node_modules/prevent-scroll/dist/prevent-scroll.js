(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["preventScroll"] = factory();
	else
		root["preventScroll"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var disabled = false;
	var currentPosition = void 0,
	    currentOverflow = void 0,
	    currentWidth = void 0;
	
	exports.default = {
	  on: function on() {
	    if (disabled) {
	      return;
	    }
	
	    disabled = true;
	
	    var htmlEl = document.querySelector('html');
	    var body = document.body;
	
	    // Determine the `scrollTop` to use. Some browsers require checking the
	    // `body`, others use `html`.
	    var bodyScrollTop = body.scrollTop;
	    var htmlScrollTop = htmlEl.scrollTop;
	    var scrollTop = bodyScrollTop ? bodyScrollTop : htmlScrollTop;
	
	    // Store the current value of the htmlEl's styles – we're about to override
	    // them.
	    currentPosition = htmlEl.style.position;
	    currentOverflow = htmlEl.style.overflowY;
	    currentWidth = htmlEl.style.width;
	
	    // Fixing the position of the `htmlEl` prevents the page from scrolling
	    // at all.
	    htmlEl.style.position = 'fixed';
	    // Setting `overflowY` to `scroll` ensures that any scrollbars that are
	    // around stick around. Otherwise, there would be a "jump" when the page
	    // becomes unscrollable as the bar would vanish.
	    htmlEl.style.overflowY = 'scroll';
	    // This makes sure that the page doesn't collapse (usually your CSS will
	    // prevent this, but it's best to be safe)
	    htmlEl.style.width = '100%';
	    // Scoot down the `htmlEl` to be in the same place that the user had
	    // scrolled to.
	    htmlEl.style.top = '-' + scrollTop + 'px';
	  },
	  off: function off() {
	    if (!disabled) {
	      return;
	    }
	
	    disabled = false;
	
	    var htmlEl = document.querySelector('html');
	    var body = document.body;
	
	    // Reset `htmlEl` to the original styles.
	    htmlEl.style.position = currentPosition;
	    htmlEl.style.overflowY = currentOverflow;
	    htmlEl.style.width = currentWidth;
	
	    // Retrieve our original scrollTop from the htmlEl's top
	    var scrollTop = -parseInt(htmlEl.style.top);
	    // Return us to the original scroll position. Once again, we set this on
	    // both the `body` and the `htmlEl` to be safe.
	    htmlEl.scrollTop = scrollTop;
	    body.scrollTop = scrollTop;
	  }
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=prevent-scroll.js.map