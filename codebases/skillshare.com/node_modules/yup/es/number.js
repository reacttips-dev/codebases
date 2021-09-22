import inherits from './util/inherits';
import MixedSchema from './mixed';
import { number as locale } from './locale';
import isAbsent from './util/isAbsent';

var isNaN = function isNaN(value) {
  return value != +value;
};

export default function NumberSchema() {
  var _this = this;

  if (!(this instanceof NumberSchema)) return new NumberSchema();
  MixedSchema.call(this, {
    type: 'number'
  });
  this.withMutation(function () {
    _this.transform(function (value) {
      var parsed = value;

      if (typeof parsed === 'string') {
        parsed = parsed.replace(/\s/g, '');
        if (parsed === '') return NaN; // don't use parseFloat to avoid positives on alpha-numeric strings

        parsed = +parsed;
      }

      if (this.isType(parsed)) return parsed;
      return parseFloat(parsed);
    });
  });
}
inherits(NumberSchema, MixedSchema, {
  _typeCheck: function _typeCheck(value) {
    if (value instanceof Number) value = value.valueOf();
    return typeof value === 'number' && !isNaN(value);
  },
  min: function min(_min, message) {
    if (message === void 0) {
      message = locale.min;
    }

    return this.test({
      message: message,
      name: 'min',
      exclusive: true,
      params: {
        min: _min
      },
      test: function test(value) {
        return isAbsent(value) || value >= this.resolve(_min);
      }
    });
  },
  max: function max(_max, message) {
    if (message === void 0) {
      message = locale.max;
    }

    return this.test({
      message: message,
      name: 'max',
      exclusive: true,
      params: {
        max: _max
      },
      test: function test(value) {
        return isAbsent(value) || value <= this.resolve(_max);
      }
    });
  },
  lessThan: function lessThan(less, message) {
    if (message === void 0) {
      message = locale.lessThan;
    }

    return this.test({
      message: message,
      name: 'max',
      exclusive: true,
      params: {
        less: less
      },
      test: function test(value) {
        return isAbsent(value) || value < this.resolve(less);
      }
    });
  },
  moreThan: function moreThan(more, message) {
    if (message === void 0) {
      message = locale.moreThan;
    }

    return this.test({
      message: message,
      name: 'min',
      exclusive: true,
      params: {
        more: more
      },
      test: function test(value) {
        return isAbsent(value) || value > this.resolve(more);
      }
    });
  },
  positive: function positive(msg) {
    if (msg === void 0) {
      msg = locale.positive;
    }

    return this.moreThan(0, msg);
  },
  negative: function negative(msg) {
    if (msg === void 0) {
      msg = locale.negative;
    }

    return this.lessThan(0, msg);
  },
  integer: function integer(message) {
    if (message === void 0) {
      message = locale.integer;
    }

    return this.test({
      name: 'integer',
      message: message,
      test: function test(val) {
        return isAbsent(val) || Number.isInteger(val);
      }
    });
  },
  truncate: function truncate() {
    return this.transform(function (value) {
      return !isAbsent(value) ? value | 0 : value;
    });
  },
  round: function round(method) {
    var avail = ['ceil', 'floor', 'round', 'trunc'];
    method = method && method.toLowerCase() || 'round'; // this exists for symemtry with the new Math.trunc

    if (method === 'trunc') return this.truncate();
    if (avail.indexOf(method.toLowerCase()) === -1) throw new TypeError('Only valid options for round() are: ' + avail.join(', '));
    return this.transform(function (value) {
      return !isAbsent(value) ? Math[method](value) : value;
    });
  }
});