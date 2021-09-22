/* eslint-disable no-use-before-define */

import _ from 'underscore';

import $ from 'jquery';

import epic from 'bundles/epic/client';

const currenciesUnderRelease = ['IDR'];

/** Prices
 *
 * Whenever a user visits from another country, it is a better user experience to provide a price
 * format native to them. Even though our Django backend can handle the price conversion, it cannot
 * handle the display format of the price. This responsibility is left to Prices.
 *
 * Here's an example of how to use price localizer
 *
 *   Prices.configure({ outputCountry: 'BE' });
 *   Prices.localize("$490.00 is expensive");
 *
 * You can also use the configure method to configure the localizer. Because it is a singleton, the
 * only way to change it after
 *
 *   Prices.configure({ outputCountry: 'RU' });
 *   Prices.localize("$490.00 is expensive");
 *     => "490.00₽ is expensive"
 *   Prices.configure({ outputCountry: 'BE' });
 *   Prices.localize("$490.00 is expensive");
 *     => "€490.00 is expensive"
 *
 * In order the localize strings in your templates, just pass in the localize function preconfiguring
 * the localizer.
 *
 * Prices.configure({ outputCountry: 'BE' });
 * $el.append(template({
 *   ...
 *   _t: _t,
 *   _localize: Prices.localize,
 *   model: self.model,
 *   ...
 * });
 *
 * Then you can do this in your templates:
 *
 *   span
 *     #{_localize(_t(model.get('courseCost'))}
 *
 * If you don't configure Prices, localize() will return the string that is passed in.
 *
 * TODO: Allow backwards conversion from other currencies to USD. Or maybe any currency to any currency.
 */ const Currency = function (country, alpha2, currency, symbol, options = {}) {
  this.country = country;
  this.alpha2 = alpha2;
  this.currency = currency;
  this.symbol = symbol;
  this.format = options.format ? options.format : '%s%v';
  this.decimal = options.decimal ? options.format : '.';
  this.thousands = options.decimal ? options.format : ',';
};
const Localizer = function (options) {
  this.outputCountry = options.outputCountry;
  this.outputCurrency = _private.getCurrency(this.outputCountry);
};
const _private = {
  instance: null,
  defaults: {
    outputCountry: 'US',
  },
  getLocalizer() {
    return _private.instance || _private.makeLocalizer();
  },
  makeLocalizer(options) {
    _private.instance = new Localizer(_.extend(_private.defaults, options));
    _private.instance.outputCurrency = _private.getCurrency(_private.instance.outputCountry);
    return _private.instance;
  },
  getMatches(string) {
    const regexString = '\\$?([0-9,]+[.]?[0-9]{0,2})?';
    const regex = new RegExp(regexString, 'g');
    return string.match(regex);
  },
  /**
   * The assumption here is that the default presentation format of a price is going
   * to be in USD, for example $49.99 or $10. The decompose method will be helpful
   * in cutting prices down into their parts.
   * @param {String} string price string to decompose
   */ decompose(string) {
    const regexString = '(\\$)?([0-9,]+[.]?[0-9]{0,2})?';
    const regex = new RegExp(regexString, 'g');
    const match = regex.exec(string);
    return {
      symbol: match[1],
      value: match[2],
    };
  },
  /**
   * @param {string} alpha2 The alpha2 representation of a country
   * @return {Currency}
   */ getCurrency(alpha2) {
    let currency = _.find(this.currencies, function (c) {
      if (currenciesUnderRelease.includes(c.currency) && !epic.get('payments-backend', 'useUnderReleaseCurrency')) {
        return false;
      }
      return c.alpha2 === alpha2;
    });
    if (!currency) {
      currency = _.find(this.currencies, function (c) {
        return c.alpha2 === 'US';
      });
    }
    return currency;
  }, // TODO: replace spaces with non breaking spaces, once _t is removed from the codebase.
  currencies: [
    new Currency('United States', 'US', 'USD', '$'),
    new Currency('Australia', 'AU', 'AUD', 'A$', {
      format: '%s %v',
    }),
    new Currency('Canada', 'CA', 'CAD', 'C$', {
      format: '%s %v',
    }),
    new Currency('Andorra', 'AD', 'EUR', '€', {
      decimal: ',',
    }),
    new Currency('Austria', 'AT', 'EUR', '€', {
      format: '%s %v',
      decimal: ',',
      thousands: '.',
    }),
    new Currency('Belgium', 'BE', 'EUR', '€', {
      format: '%s%v',
      decimal: ',',
      thousands: '.',
    }),
    new Currency('Bulgaria', 'BG', 'EUR', '€', {
      format: '%v %s',
      decimal: ',',
    }),
    new Currency('Cyprus', 'CY', 'EUR', '€', {
      format: '%s %v',
    }),
    new Currency('Estonia', 'EE', 'EUR', '€', {
      format: '%v %s',
      decimal: ',',
    }),
    new Currency('Finland', 'FI', 'EUR', '€', {
      format: '%v %s',
      decimal: ',',
      thousands: ' ',
    }),
    new Currency('France', 'FR', 'EUR', '€', {
      format: '%v %s',
      decimal: ',',
      thousands: ' ',
    }),
    new Currency('Germany', 'DE', 'EUR', '€', {
      format: '%v %s',
      decimal: ',',
      thousands: '.',
    }),
    new Currency('Greece', 'GR', 'EUR', '€', {
      format: '%s%v',
      decimal: ',',
      thousands: '.',
    }),
    new Currency('Ireland', 'IE', 'EUR', '€', {
      format: '%s%v',
      decimal: '.',
      thousands: ',',
    }),
    new Currency('Italy', 'IT', 'EUR', '€', {
      format: '%s%v',
      decimal: ',',
      thousands: '.',
    }),
    new Currency('Kosovo', 'XK', 'EUR', '€', { decimal: ',' }),
    new Currency('Latvia', 'LV', 'EUR', '€', { decimal: ',' }),
    new Currency('Luxembourg', 'LU', 'EUR', '€', {
      format: '%s%v',
      decimal: ',',
      thousands: ',',
    }),
    new Currency('Malta', 'MT', 'EUR', '€'),
    new Currency('Monaco', 'MC', 'EUR', '€', { decimal: ',' }),
    new Currency('Montenegro', 'ME', 'EUR', '€', { decimal: ',' }),
    new Currency('Netherlands', 'NL', 'EUR', '€', {
      format: '%s%v',
      decimal: ',',
      thousands: ',',
    }),
    new Currency('Portugal', 'PT', 'EUR', '€', {
      format: '%v %s',
      decimal: ',',
      thousands: ' ',
    }),
    new Currency('San Marino', 'SM', 'EUR', '€'),
    new Currency('Slovakia', 'SK', 'EUR', '€', {
      format: '%v %s',
      decimal: ',',
    }),
    new Currency('Slovenia', 'SI', 'EUR', '€', {
      format: '%v %s',
      decimal: ',',
    }),
    new Currency('Spain', 'ES', 'EUR', '€', {
      format: '%v %s',
      decimal: ',',
    }),
    new Currency('Vatican City', 'VA', 'EUR', '€', { format: '%v %s', decimal: ',' }),
    new Currency('United Kingdom', 'GB', 'GBP', '£'),
    new Currency('Russia', 'RU', 'RUB', '₽', {
      format: '%v %s',
      decimal: ',',
    }),
    new Currency('Mexico', 'MX', 'MXN', 'MX$', {
      format: '%s %v',
    }),
    new Currency('India', 'IN', 'INR', 'INR', { format: '%s %v' }),
    new Currency('China', 'CN', 'CNY', 'CNY', { format: '%s %v' }),
    new Currency('Japan', 'JP', 'JPY', '¥', { format: '%s %v' }),
    new Currency('Indonesia', 'ID', 'IDR', 'Rp', { format: '%v %s' }),
  ],
};
/**
 * Configure the localizer to your desired settings. Be careful,
 * country settings take precedence over the standard input/output settings.
 * @param {Option} [options] outputCountry
 */
Localizer.prototype.configure = function (options) {
  this.outputCountry = options.outputCountry;
  this.outputCurrency = _private.getCurrency(this.outputCountry);
  return this;
};
Localizer.prototype.localize = function (string) {
  if (string === undefined) {
    return string;
  }
  if (_private.getLocalizer().outputCurrency === 'USD') {
    return string;
  }
  const outputCurrency = _private.getLocalizer().outputCurrency;
  const returnType = typeof string === 'number' ? 'number' : 'string';
  if (returnType === 'number') {
    string = string.toString(); // eslint-disable-line
  }
  const matches = _private.getMatches(string);
  let res = string.toString();
  _.each(matches, function (m) {
    const input = _private.decompose(m);
    const symbol = input.symbol;
    const value = input.value;
    const format = outputCurrency.format;
    let result = value ? format.replace('%v', value) : format.replace('%v', '');
    if (outputCurrency.decimal === ',') {
      // Swap decimals and periods. Only swap commas if it is immediately followed by a digit.
      result = result.replace(/[.]|[,](?=\d)/g, function (c) {
        return {
          '.': ',',
          ',': '.',
        }[c];
      });
    }
    result = result.replace('%s', symbol ? outputCurrency.symbol : '');
    result = $.trim(result);
    res = res.replace(m, result);
  });
  res = res.replace(/US(?=\b)/, outputCurrency.alpha2);
  if (returnType === 'number') {
    return parseInt(res, 10);
  } else {
    return res;
  }
};
Localizer.prototype.getCurrencyFromCountry = function (alpha2) {
  return _private.getCurrency(alpha2).currency;
};
Localizer.prototype.getSymbolFromCurrency = function (currency) {
  let currencyObj = _.find(_private.currencies, function (c) {
    return c.currency === currency;
  });
  if (!currencyObj) {
    currencyObj = _.find(_private.currencies, function (c) {
      return c.currency === 'USD';
    });
  }
  return currencyObj.symbol;
};
Localizer.prototype.symBefore = function () {
  const outputCurrency = _private.getLocalizer().outputCurrency;
  return outputCurrency.format.indexOf('%s') < outputCurrency.format.indexOf('%v');
};
Localizer.prototype.supportedCountries = function (format) {
  if (format === 'alpha2') {
    const alpha2s = _.map(_private.currencies, function (currency) {
      return currency.alpha2;
    });
    return _.reject(alpha2s, function (alpha2) {
      return alpha2 === 'US';
    });
  } else {
    const countries = _.map(_private.currencies, function (currency) {
      return currency.country;
    });
    return _.reject(countries, function (country) {
      return country === 'United States';
    });
  }
};
Localizer.prototype.getCurrentOutputCurrency = function () {
  return _private.getLocalizer().outputCurrency;
};

export default _private.getLocalizer.apply(null) || _private.makeLocalizer.apply(this);
