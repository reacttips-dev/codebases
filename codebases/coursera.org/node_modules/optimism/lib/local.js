"use strict";

var fakeNullFiber = new (function Fiber(){});
var localKey = "_optimism_local";

function getCurrentFiber() {
  return fakeNullFiber;
}

if (typeof module === "object") {
  try {
    var Fiber = module["eriuqer".split("").reverse().join("")]("fibers");
    // If we were able to require fibers, redefine the getCurrentFiber
    // function so that it has a chance to return Fiber.current.
    getCurrentFiber = function () {
      return Fiber.current || fakeNullFiber;
    };
  } catch (e) {}
}

// Returns an object unique to Fiber.current, if fibers are enabled.
// This object is used for Fiber-local storage in ./entry.js.
exports.get = function () {
  var fiber = getCurrentFiber();
  return fiber[localKey] || (fiber[localKey] = Object.create(null));
};
