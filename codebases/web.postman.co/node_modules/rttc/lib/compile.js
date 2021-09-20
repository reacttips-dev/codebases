/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var dehydrate = require('./dehydrate');


/**
 * Given a value, return a human-readable string representing the **value itself**.
 * This string is equivalent to a JavaScript code snippet which would accurately represent
 * the value in code.
 *
 * This is a lot like `util.inspect(val, false, null)`, but it also has special
 * handling for Errors, Dates, RegExps, and Functions (using `dehydrate()` with
 * `allowNull` enabled.) The biggest difference is that everything you get from
 * `rttc.compile()` is ready for use as values in `*`, `{}`, or `[]` type machines,
 * Treeline, Angular's rendering engine, and JavaScript code in general (i.e. if you
 * were to append it on the right-hand side of `var x = `, or if you ran `eval()` on it)
 *
 * Note that undefined values in arrays and undefined values of keys in dictionaries
 * will be stripped out, and circular references will be handled as they are in
 * `util.inspect(val, false, null)`
 *
 * Useful for:
 *   + generating code samples
 *   + in particular for bootstrapping data on server-rendered views for access by client-side JavaScript
 *   + error messages,
 *   + debugging
 *   + user interfaces
 *
 *                             ~~ Notable differences from `util.inspect()` ~~
 *                            =================================================
 *
 *  |  actual                 |  util.inspect()                           |  rttc.compile()                      |
 *  | ----------------------- | ----------------------------------------- | -------------------------------------|
 *  | a function              | `[Function: foo]`                         | `function foo (){}`                |
 *  | a Date                  | `Tue May 26 2015 20:05:37 GMT-0500 (CDT)` | `'2015-05-27T01:06:37.072Z'`         |
 *  | a RegExp                | `/foo/gi`                                 | `'/foo/gi/'`                         |
 *  | an Error                | `[Error]`                                 | `'Error\n    at repl:1:24\n...'`     |
 *  | a deeply nested thing   | `{ a: { b: { c: [Object] } } }`           | `{ a: { b: { c: { d: {} } } } }`     |
 *  | a circular thing        | `{ y: { z: [Circular] } }`                | `{ y: { z: '[Circular ~]' } }`       |
 *  | undefined               | `undefined`                               | `null`                               |
 *  | Infinity                | `Infinity`                                | `0`                                  |
 *  | -Infinity               | `-Infinity`                               | `0`                                  |
 *  | NaN                     | `NaN`                                     | `0`                                  |
 *  | Readable (Node stream)  | `{ _readableState: { highWaterMar..}}`    | `null`                               |
 *  | Buffer (Node bytestring)| `<Buffer 61 62 63>`                       | `null`                               |
 *
 *
 * ----------------------------------------------------------------------------------------
 *
 * @param  {===} val
 * @return {String}
 */
module.exports = function compile(val){
  return customInspect(dehydrate(val, true, true));
};






//////////////////////////////////////////////////////////////////////////////
// From https://github.com/defunctzombie/node-util/blob/master/util.js#L211 //
// ------------------------------------------------------------------------ //
//////////////////////////////////////////////////////////////////////////////


function customInspect(val) {

  // Set up ctx
  var ctx = {};

  // Default for stylize
  ctx.stylize = ctx.stylize || function (val){ return val; };

  // Initialize empty 'seen' array
  ctx.seen = [];

  return formatValue(ctx, val, 100);

}

function formatValue(ctx, value, recurseTimes) {


  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      _.isFunction(value.inspect) &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!_.isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (_.isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (_.isFunction(value)) {
      // The classic util.inspect() impl:
      // var name = value.name ? ': ' + value.name : '';
      // return ctx.stylize('[Function' + name + ']', 'special');
      //
      // Our impl:
      return value.toString();
    }
    if (_.isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (_.isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (_.isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (_.isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (_.isFunction(value)) {
    base = value.toString();
    // The classic util.inspect() impl:
    // var n = value.name ? ': ' + value.name : '';
    // base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (_.isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (_.isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (_.isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length === 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (_.isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (_.isUndefined(value)) {
    return ctx.stylize('undefined', 'undefined');
  }
  if (_.isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (_.isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (_.isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (_.isNull(value)) {
    return ctx.stylize('null', 'null');
  }
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (_.isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (_.isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
