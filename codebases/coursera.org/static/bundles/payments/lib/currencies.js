// For more info about supported currencies: https://coursera.atlassian.net/wiki/spaces/GROW/pages/282984479/Geo-Pricing+and+Local+Currency
// Currency decimal places defined in ISO 4217: https://en.wikipedia.org/wiki/ISO_4217
const currencies = [
  {
    id: 36,
    code: 'AUD',
    symbol: 'A$',
    decimalPlaces: 2,
  },
  {
    id: 124,
    code: 'CAD',
    symbol: '$',
    decimalPlaces: 2,
  },
  {
    id: 156,
    code: 'CNY',
    symbol: '¥',
    decimalPlaces: 2,
  },
  {
    id: 208,
    code: 'DKK',
    symbol: 'kr',
    decimalPlaces: 2,
  },
  {
    id: 344,
    code: 'HKD',
    symbol: '$',
    decimalPlaces: 2,
  },
  {
    id: 356,
    code: 'INR',
    symbol: 'Rs',
    decimalPlaces: 2,
  },
  {
    id: 360,
    code: 'IDR',
    symbol: 'Rp',
    decimalPlaces: 2,
  },
  {
    id: 376,
    code: 'ILS',
    symbol: '₪',
    decimalPlaces: 2,
  },
  {
    id: 392,
    code: 'JPY',
    symbol: '¥',
    decimalPlaces: 0,
  },
  {
    id: 484,
    code: 'MXN',
    symbol: '$',
    decimalPlaces: 2,
  },
  {
    id: 554,
    code: 'NZD',
    symbol: '$',
    decimalPlaces: 2,
  },
  {
    id: 578,
    code: 'NOK',
    symbol: 'kr',
    decimalPlaces: 2,
  },
  {
    id: 643,
    code: 'RUB',
    symbol: '₽',
    decimalPlaces: 2,
  },
  {
    id: 682,
    code: 'SAR',
    symbol: '﷼',
    decimalPlaces: 2,
  },
  {
    id: 702,
    code: 'SGD',
    symbol: 'S$',
    decimalPlaces: 2,
  },
  {
    id: 710,
    code: 'ZAR',
    symbol: 'R',
    decimalPlaces: 2,
  },
  {
    id: 752,
    code: 'SEK',
    symbol: 'kr',
    decimalPlaces: 2,
  },
  {
    id: 756,
    code: 'CHF',
    symbol: '',
    decimalPlaces: 2,
  },
  {
    id: 784,
    code: 'AED',
    symbol: 'د.إ',
    decimalPlaces: 2,
  },
  {
    id: 826,
    code: 'GBP',
    symbol: '£',
    decimalPlaces: 2,
  },
  {
    id: 840,
    code: 'USD',
    symbol: '$',
    decimalPlaces: 2,
  },
  {
    id: 901,
    code: 'TWD',
    symbol: 'NT$',
    decimalPlaces: 2,
  },
  {
    id: 949,
    code: 'TRY',
    symbol: 'TL',
    decimalPlaces: 2,
  },
  {
    id: 978,
    code: 'EUR',
    symbol: '€',
    decimalPlaces: 2,
  },
  {
    id: 986,
    code: 'BRL',
    symbol: 'R$',
    decimalPlaces: 2,
  },
];

export const currencyIdMap = currencies.reduce((map, currency) => {
  // eslint-disable-next-line no-param-reassign
  map[currency.id] = currency;
  return map;
}, {});

export const currencyCodeMap = currencies.reduce((map, currency) => {
  // eslint-disable-next-line no-param-reassign
  map[currency.code] = currency;
  return map;
}, {});
