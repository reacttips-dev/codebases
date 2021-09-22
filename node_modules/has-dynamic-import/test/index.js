'use strict';

var test = require('tape');
var semver = require('semver');
var isBrowser = typeof window !== 'undefined';
var isNode = !isBrowser && typeof process !== 'undefined';
// eslint-disable-next-line global-require
var spawnSync = isNode && require('child_process').spawnSync;

var hasFullSupport = require('../');
var hasSyntax = require('../syntax');

var browserHasFullSupport = require('../browser');
var browserHasSyntax = require('../browser-syntax');

test('hasFullSupport', function (t) {
	t.equal(typeof hasFullSupport, 'function', 'is a function');

	t.test('node', { skip: !isNode }, function (st) {
		var promise = hasFullSupport();

		st.equal(typeof promise.then, 'function', 'returns a thenable');

		promise.then(function (result) {
			st.equal(
				result,
				semver.satisfies(process.version, '^12.17 || ^13.2 || >=14'),
				'result matches expected node version range'
			);

			st.end();
		});
	});

	t.test('experimental warning', { skip: !spawnSync || process.env.RECURSION }, function (st) {
		st.plan(1);
		var res = spawnSync('node', ['test'], {
			env: { PATH: process.env.PATH, RECURSION: 'recursion' }
		});
		if (semver.satisfies(process.version, '^12.17 <12.20 || ^13.4 < 13.14')) {
			st.ok(String(res.stderr), 'stderr has an experimental warning in it');
		} else {
			st.equal(String(res.stderr), '', 'stderr is empty');
		}
	});

	t.test('browser', function (st) {
		var promise = browserHasFullSupport();

		st.equal(typeof promise.then, 'function', 'returns a thenable');

		promise.then(function (result) {
			hasFullSupport().then(function (nodeResult) {
				st.equal(
					result,
					nodeResult,
					'matches result from node implementation'
				);

				st.end();
			});
		});
	});

	t.test('browser', function (st) {
		var result = browserHasSyntax();

		st.equal(typeof result, 'boolean', 'returns a boolean');
		st.equal(
			result,
			hasSyntax(),
			'matches result from node implementation'
		);

		st.end();
	});
});

test('hasSyntax', function (t) {
	t.equal(typeof hasSyntax, 'function', 'is a function');

	t.test('node', { skip: !isNode }, function (st) {
		var result = hasSyntax();

		st.equal(typeof result, 'boolean', 'returns a boolean');
		st.equal(
			result,
			semver.satisfies(process.version, '>=10'),
			'result matches expected node version range'
		);

		st.end();
	});

	t.test('browser', function (st) {
		var result = browserHasSyntax();

		st.equal(typeof result, 'boolean', 'returns a boolean');
		st.equal(
			result,
			hasSyntax(),
			'matches result from node implementation'
		);

		st.end();
	});
});
