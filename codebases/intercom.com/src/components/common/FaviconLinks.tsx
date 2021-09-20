import React from 'react'

import Head from 'next/head'

import iphoneFavicon from 'marketing-site/src/images/apple-touch-icon-iphone.png'
import iphone4Favicon from 'marketing-site/src/images/apple-touch-icon-iphone4.png'
import ipadFavicon from 'marketing-site/src/images/apple-touch-icon-ipad.png'
import favicon from 'marketing-site/src/images/favicon.png'

const FaviconLinks: React.FC = () => {
  return (
    <Head>
      <link rel="apple-touch-icon-precomposed" type="image/png" href={iphoneFavicon} />
      <link
        rel="apple-touch-icon-precomposed"
        type="image/png"
        href={iphone4Favicon}
        sizes="72x72"
      />
      <link
        rel="apple-touch-icon-precomposed"
        type="image/png"
        href={ipadFavicon}
        sizes="114x114"
      />
      <link rel="shortcut icon" type="image/png" href={favicon} />
    </Head>
  )
}

export default FaviconLinks
