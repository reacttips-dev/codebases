import path from 'path'

import { CONTENTFUL_DEFAULT_LOCALE_CODE } from 'marketing-site/@types/generated/contentful'
import { ICurrentPath } from 'marketing-site/src/components/context/CurrentPathContext'

export const DEFAULT_LOCALE_CODE: CONTENTFUL_DEFAULT_LOCALE_CODE = 'en-US'

interface IArguments {
  localeCode: string
  pathname: string
  preserveQuery?: boolean
}

export default function buildPath({
  localeCode,
  pathname,
  preserveQuery = false,
}: IArguments): ICurrentPath {
  if (pathname === 'index') pathname = ''
  if (typeof window !== 'undefined' && preserveQuery) pathname += window.location.search

  const plain = path.join('/', pathname)
  const localized = path.join('/', localePathSegment(localeCode), pathname)
  const canonical = `https://www.intercom.com${path.join('/', localized)}`

  return {
    plain,
    localized,
    canonical,
  }
}

function localePathSegment(localeCode: string): string {
  if (localeCode === DEFAULT_LOCALE_CODE) {
    return ''
  }

  return localeCode
}
