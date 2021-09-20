'use strict';

var inspect = require('util').inspect;
var format = require('./format');

var _require = require('triple-beam'),
    MESSAGE = _require.MESSAGE;

/*
 * function prettyPrint (info)
 * Returns a new instance of the prettyPrint Format that "prettyPrint"
 * serializes `info` objects. This was previously exposed as
 * { prettyPrint: true } to transports in `winston < 3.0.0`.
 */


module.exports = format(function (info, opts) {
  info[MESSAGE] = inspect(info, false, opts.depth || null, opts.colorize);
  return info;
});