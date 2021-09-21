'use strict';

var he = require('he');
var lowercase = require('./lowercase');
var attributes = require('./attributes');
var elements = require('./elements');
var rstart = /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/;
var rend = /^<\s*\/\s*([\w:-]+)[^>]*>/;
var rattrs = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g;
var rtag = /^</;
var rtagend = /^<\s*\//;

function createStack () {
  var stack = [];
  stack.lastItem = function lastItem () {
    return stack[stack.length - 1];
  };
  return stack;
}

function parser (html, handler) {
  var stack = createStack();
  var last = html;
  var chars;

  while (html) {
    parsePart();
  }
  parseEndTag(); // clean up any remaining tags

  function parsePart () {
    chars = true;
    parseTag();

    var same = html === last;
    last = html;

    if (same) { // discard, because it's invalid
      html = '';
    }
  }

  function parseTag () {
    if (html.substr(0, 4) === '<!--') { // comments
      parseComment();
    } else if (rtagend.test(html)) {
      parseEdge(rend, parseEndTag);
    } else if (rtag.test(html)) {
      parseEdge(rstart, parseStartTag);
    }
    parseTagDecode();
  }

  function parseEdge (regex, parser) {
    var match = html.match(regex);
    if (match) {
      html = html.substring(match[0].length);
      match[0].replace(regex, parser);
      chars = false;
    }
  }

  function parseComment () {
    var index = html.indexOf('-->');
    if (index >= 0) {
      if (handler.comment) {
        handler.comment(html.substring(4, index));
      }
      html = html.substring(index + 3);
      chars = false;
    }
  }

  function parseTagDecode () {
    if (!chars) {
      return;
    }
    var text;
    var index = html.indexOf('<');
    if (index >= 0) {
      text = html.substring(0, index);
      html = html.substring(index);
    } else {
      text = html;
      html = '';
    }
    if (handler.chars) {
      handler.chars(text);
    }
  }

  function parseStartTag (tag, tagName, rest, unary) {
    var attrs = {};
    var low = lowercase(tagName);
    var u = elements.voids[low] || !!unary;

    rest.replace(rattrs, attrReplacer);

    if (!u) {
      stack.push(low);
    }
    if (handler.start) {
      handler.start(low, attrs, u);
    }

    function attrReplacer (match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
      if (doubleQuotedValue === void 0 && singleQuotedValue === void 0 && unquotedValue === void 0) {
        attrs[name] = void 0; // attribute is like <button disabled></button>
      } else {
        attrs[name] = he.decode(doubleQuotedValue || singleQuotedValue || unquotedValue || '');
      }
    }
  }

  function parseEndTag (tag, tagName) {
    var i;
    var pos = 0;
    var low = lowercase(tagName);
    if (low) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos] === low) {
          break; // find the closest opened tag of the same type
        }
      }
    }
    if (pos >= 0) {
      for (i = stack.length - 1; i >= pos; i--) {
        if (handler.end) { // close all the open elements, up the stack
          handler.end(stack[i]);
        }
      }
      stack.length = pos;
    }
  }
}

module.exports = parser;
