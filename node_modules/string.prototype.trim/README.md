String.prototype.trim <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

[![browser support][testling-svg]][testling-url]

An ES5 spec-compliant `String.prototype.trim` shim. Invoke its "shim" method to shim `String.prototype.trim` if it is unavailable.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment and complies with the spec (both [ES5](https://262.ecma-international.org/5.1/#sec-15.5.4.20) and [current](https://tc39.es/ecma262/#sec-string.prototype.trim)).

Most common usage:

```js
var assert = require('assert');
var trim = require('string.prototype.trim');

assert(trim(' \t\na \t\n') === 'a');

trim.shim(); // will be a no-op if not needed

assert(trim(' \t\na \t\n') === ' \t\na \t\n'.trim());
```

## Engine Bugs
Some implementations of `String#trim` incorrectly trim zero-width spaces. This shim detects and corrects this behavior.

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.com/package/string.prototype.trim
[npm-version-svg]: https://versionbadg.es/es-shims/String.prototype.trim.svg
[deps-svg]: https://david-dm.org/es-shims/String.prototype.trim.svg
[deps-url]: https://david-dm.org/es-shims/String.prototype.trim
[dev-deps-svg]: https://david-dm.org/es-shims/String.prototype.trim/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/String.prototype.trim#info=devDependencies
[testling-svg]: https://ci.testling.com/es-shims/String.prototype.trim.png
[testling-url]: https://ci.testling.com/es-shims/String.prototype.trim
[npm-badge-png]: https://nodei.co/npm/string.prototype.trim.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/string.prototype.trim.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/string.prototype.trim.svg
[downloads-url]: https://npm-stat.com/charts.html?package=string.prototype.trim
