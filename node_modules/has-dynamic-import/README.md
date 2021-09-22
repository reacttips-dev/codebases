# has-dynamic-import <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

Does the current environment have `import()` support?

At the time of this writing, node v12.17+, v13.2+ and v14.0+ has support for dynamic [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports); the syntax is supported in node v10+.

The former can be checked in the package‘s main export, which is an `async function` that returns a boolean indicating if the current environment fully supports dynamic import. Note that in node v12.17 - v12.19 and v13.4 - v13.13, an ExperimentalWarning will be logged.

The latter can be checked with `'has-dynamic-import/syntax'`, which is a function that returns a boolean indicating if the current environment supports parsing the syntax of dynamic import.

## Tests

Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/has-dynamic-import
[npm-version-svg]: https://versionbadg.es/inspect-js/has-dynamic-import.svg
[deps-svg]: https://david-dm.org/inspect-js/has-dynamic-import.svg
[deps-url]: https://david-dm.org/inspect-js/has-dynamic-import
[dev-deps-svg]: https://david-dm.org/inspect-js/has-dynamic-import/dev-status.svg
[dev-deps-url]: https://david-dm.org/inspect-js/has-dynamic-import#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/has-dynamic-import.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/has-dynamic-import.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/has-dynamic-import.svg
[downloads-url]: https://npm-stat.com/charts.html?package=has-dynamic-import
[codecov-image]: https://codecov.io/gh/inspect-js/has-dynamic-import/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/inspect-js/has-dynamic-import/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/inspect-js/has-dynamic-import
[actions-url]: https://github.com/inspect-js/has-dynamic-import/actions
