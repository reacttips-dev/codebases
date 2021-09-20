'use strict';

/**
 * Prevent default on a given event.
 *
 * @param {Event} e
 * @example
 * anchor.onclick = prevent;
 * anchor.onclick = function(e){
 *   if (something) return prevent(e);
 * };
 */

function preventDefault(e) {
  e = e || window.event;
  return e.preventDefault ? e.preventDefault() : e.returnValue = false;
}

/*
 * Exports.
 */

module.exports = preventDefault;
