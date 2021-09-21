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

// Polyfill to address Safari https://github.com/elastic/cloud/issues/56387
import 'intl-pluralrules'

import { registerLocale as registerCountriesLocale } from 'i18n-iso-countries'
import enCountries from 'i18n-iso-countries/langs/en.json'
import deCountries from 'i18n-iso-countries/langs/de.json'
import frCountries from 'i18n-iso-countries/langs/fr.json'
import jaCountries from 'i18n-iso-countries/langs/ja.json'

export { default as enMessages } from './en.json'

export function addLocales() {
  addCountryLocales()
}

function addCountryLocales() {
  // Load country name and code information
  registerCountriesLocale(enCountries)
  registerCountriesLocale(deCountries)
  registerCountriesLocale(frCountries)
  registerCountriesLocale(jaCountries)
}
