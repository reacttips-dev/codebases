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

type SupportedLanguage = 'en' | 'de' | 'fr' | 'ja'

export const supportedLanguages: SupportedLanguage[] = ['en', 'de', 'fr', 'ja']

// Really, this function should just accept NavigatorLanguage, but the actual
// signature reflects its tolerance for bad inputs
export function getLanguage(
  root: Partial<NavigatorLanguage> | null | undefined,
): SupportedLanguage {
  if (root == null) {
    return `en`
  }

  const candidateLocales = [
    ...(Array.isArray(root.languages) ? root.languages : []),
    root.language,

    // @ts-ignore this is an Internet Explorer property
    root.userLanguage,
  ]

  const selectedLang = candidateLocales
    .filter((locale) => Boolean(locale))
    .map((locale) => locale.split('-')[0])
    .find((locale) => supportedLanguages.includes(locale))

  return selectedLang || 'en'
}
