/* eslint-disable */
/*!
  webvtt Javascript parser for node, from olafursverrir 
  https://www.npmjs.com/package/node-webvtt
  github.com/ozinc/node-webvtt
  license: MIT
*/

// the original package is somehow incompatible with webpack, copying the parse function into this file

'use strict';

function ParserError(message: $TSFixMe, error: $TSFixMe) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.message = message;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.error = error;
}
ParserError.prototype = Object.create(Error.prototype);

const TIMESTAMP_REGEXP = /([0-9]{1,2})?:?([0-9]{2}):([0-9]{2}\.[0-9]{3})/;

function parse(input: $TSFixMe) {
  if (typeof input !== 'string') {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new ParserError('Input must be a string');
  }

  input = input.replace(/\r\n/g, '\n');
  input = input.replace(/\r/g, '\n');

  const parts = input.split('\n\n');

  const header = parts.shift();

  if (!header.startsWith('WEBVTT')) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new ParserError('Must start with "WEBVTT"');
  }

  const headerParts = header.split('\n');

  // nothing of interests, return early
  if (parts.length === 0 && headerParts.length === 1) {
    return { valid: true };
  }

  if (headerParts.length > 1 && headerParts[1] !== '') {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new ParserError('No blank line after signature');
  }

  const cues = parseCues(parts);

  return { valid: true, cues };
}

function parseCues(cues: $TSFixMe) {
  return cues.map(parseCue);
}

function parseCue(cue: $TSFixMe, i: $TSFixMe) {
  let identifier = '';
  let start = 0;
  let end = 0;
  let text = '';
  let styles = '';

  // split and remove empty lines
  const lines = cue.split('\n').filter(Boolean);

  if (lines.length === 1 && !lines[0].includes('-->')) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new ParserError(`Cue identifier cannot be standalone (cue #${i})`);
  }

  if (lines.length > 1 && !(lines[0].includes('-->') || lines[1].includes('-->'))) {
    const msg = `Cue identifier needs to be followed by timestamp (cue #${i})`;
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new ParserError(msg);
  }

  if (lines.length > 1 && lines[1].includes('-->')) {
    identifier = lines.shift();
  }

  if (lines.length > 0 && lines[0].includes('-->')) {
    const times = lines[0].split(' --> ');

    if (times.length !== 2 || !validTimestamp(times[0]) || !validTimestamp(times[1])) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new ParserError(`Invalid cue timestamp (cue #${i})`);
    }

    start = parseTimestamp(times[0]);
    end = parseTimestamp(times[1]);

    if (start > end) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new ParserError(`Start timestamp greater than end (cue #${i})`);
    }

    if (end < start) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new ParserError(`End must be greater or equal than start (cue #${i})`);
    }

    // TODO better style validation
    styles = times[1].replace(TIMESTAMP_REGEXP, '').trim();

    lines.shift();
  }

  text = lines.join('\n');

  return { identifier, start, end, text, styles };
}

function validTimestamp(timestamp: $TSFixMe) {
  return TIMESTAMP_REGEXP.test(timestamp);
}

function parseTimestamp(timestamp: $TSFixMe) {
  const matches = timestamp.match(TIMESTAMP_REGEXP);

  let secs = parseFloat(matches[3]);
  secs += parseFloat(matches[2]) * 60; // mins
  secs += parseFloat(matches[1] || 0) * 60 * 60; // hours
  return secs;
}

export default {
  ParserError,
  parse,
};

export { ParserError, parse };
