/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { defineMessages, IntlShape } from 'react-intl'

const messages = defineMessages({
  currencyName_ARS: { id: `money.ars-name`, defaultMessage: `Argentine peso` },
  currencyName_AUD: { id: `money.aud-name`, defaultMessage: `Australian dollar` },
  currencyName_BRL: { id: `money.brl-name`, defaultMessage: `Brazilian real` },
  currencyName_CAD: { id: `money.cad-name`, defaultMessage: `Canadian dollar` },
  currencyName_CHF: { id: `money.chf-name`, defaultMessage: `Swiss franc` },
  currencyName_CNY: { id: `money.cny-name`, defaultMessage: `Chinese yuan` },
  currencyName_CZK: { id: `money.czk-name`, defaultMessage: `Czech koruna` },
  currencyName_DKK: { id: `money.dkk-name`, defaultMessage: `Danish krone` },
  currencyName_EUR: { id: `money.eur-name`, defaultMessage: `Euro` },
  currencyName_GBP: { id: `money.gbp-name`, defaultMessage: `Pound sterling` },
  currencyName_HKD: { id: `money.hkd-name`, defaultMessage: `Hong Kong dollar` },
  currencyName_HUF: { id: `money.huf-name`, defaultMessage: `Hungarian forint` },
  currencyName_ILS: { id: `money.ils-name`, defaultMessage: `Israeli new shekel` },
  currencyName_INR: { id: `money.inr-name`, defaultMessage: `Indian rupee` },
  currencyName_JPY: { id: `money.jpy-name`, defaultMessage: `Japanese yen` },
  currencyName_KRW: { id: `money.krw-name`, defaultMessage: `South Korean won` },
  currencyName_NOK: { id: `money.nok-name`, defaultMessage: `Norwegian krone` },
  currencyName_PAB: { id: `money.pab-name`, defaultMessage: `Panamanian balboa` },
  currencyName_PLN: { id: `money.pln-name`, defaultMessage: `Polish złoty` },
  currencyName_RON: { id: `money.ron-name`, defaultMessage: `Romanian leu` },
  currencyName_SEK: { id: `money.sek-name`, defaultMessage: `Swedish krona` },
  currencyName_SGD: { id: `money.sgd-name`, defaultMessage: `Singapore dollar` },
  currencyName_USD: { id: `money.usd-name`, defaultMessage: `United States dollar` },
  currencyName_UYU: { id: `money.uyu-name`, defaultMessage: `Uruguayan peso` },
})

const currencies = {
  ARS: {
    symbol: `N$`,
    name: messages.currencyName_ARS,
  },
  AUD: {
    symbol: `A$`,
    name: messages.currencyName_AUD,
  },
  BRL: {
    symbol: `R$`,
    name: messages.currencyName_BRL,
  },
  CAD: {
    symbol: `C$`,
    name: messages.currencyName_CAD,
  },
  CHF: {
    symbol: `₣`,
    name: messages.currencyName_CHF,
  },
  CNY: {
    symbol: `¥`,
    name: messages.currencyName_CNY,
  },
  CZK: {
    symbol: `Kč`,
    name: messages.currencyName_CZK,
  },
  DKK: {
    symbol: `Kr.`,
    name: messages.currencyName_DKK,
  },
  EUR: {
    symbol: `€`,
    name: messages.currencyName_EUR,
  },
  GBP: {
    symbol: `£`,
    name: messages.currencyName_GBP,
  },
  HKD: {
    symbol: `HK$`,
    name: messages.currencyName_HKD,
  },
  HUF: {
    symbol: `Ft`,
    name: messages.currencyName_HUF,
  },
  ILS: {
    symbol: `₪`,
    name: messages.currencyName_ILS,
  },
  INR: {
    symbol: `₹`,
    name: messages.currencyName_INR,
  },
  JPY: {
    symbol: `¥`,
    name: messages.currencyName_JPY,
  },
  KRW: {
    symbol: `₩`,
    name: messages.currencyName_KRW,
  },
  NOK: {
    symbol: `kr`,
    name: messages.currencyName_NOK,
  },
  PAB: {
    symbol: `B/.`,
    name: messages.currencyName_PAB,
  },
  PLN: {
    symbol: `zł`,
    name: messages.currencyName_PLN,
  },
  RON: {
    symbol: `lei`,
    name: messages.currencyName_RON,
  },
  SEK: {
    symbol: `kr`,
    name: messages.currencyName_SEK,
  },
  SGD: {
    symbol: `S$`,
    name: messages.currencyName_SGD,
  },
  USD: {
    symbol: `$`,
    name: messages.currencyName_USD,
  },
  UYU: {
    symbol: `$U`,
    name: messages.currencyName_UYU,
  },
}

export function formatMoney(amount: number, decimals: number, currency: string = `USD`): string {
  const formattedNumber = amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  if (amount >= 0) {
    return `${getCurrencySymbol(currency)}${formattedNumber}`
  }

  return `&minus;&nbsp;${getCurrencySymbol(currency)}${formattedNumber.substr(1)}`
}

export function formatCenticent(
  amount: number,
  decimals: number,
  currency: string = `USD`,
): string {
  return formatMoney(amount / 10000.0, decimals, currency)
}

export function getCurrencyName(intl: IntlShape, currency: string): string {
  if (currencies[currency] && currencies[currency].name) {
    return intl.formatMessage(currencies[currency].name)
  }

  return currency
}

function getCurrencySymbol(currency: string): string {
  if (currencies[currency] && currencies[currency].symbol) {
    return currencies[currency].symbol
  }

  return `${currency} `
}
