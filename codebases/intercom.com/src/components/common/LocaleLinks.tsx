import React, { useContext } from 'react'

import CurrentPathContext from 'marketing-site/src/components/context/CurrentPathContext'
import LocalesContext from 'marketing-site/src/components/context/LocalesContext'
import Head from 'next/head'

import buildPath from 'marketing-site/lib/buildPath'

const LocaleLinks: React.FC = () => {
  let pathname = useContext(CurrentPathContext).plain
  const locales = useContext(LocalesContext)

  // Reference tags shouldn't use /index as it is bad SEO
  if (pathname === '/index') {
    pathname = '/'
  }

  return (
    <Head>
      {locales.map((locale) => (
        <link
          key={locale.code}
          rel="alternate"
          hrefLang={locale.code}
          href={buildPath({ localeCode: locale.code, pathname }).canonical}
        />
      ))}
    </Head>
  )
}

export default LocaleLinks
