import React from 'react'

import ClientScript from '~/components/ClientScript'

const scriptBody = ({
    id,
    envGetParams
}) => `
  (function(w,d,s,l,i,k){
    w[l]=w[l]||[];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event:'gtm.js'
    });
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),
        dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl+k;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${id}','${envGetParams}');
`

const GoogleTagManagerScripts = ({
    delay,
    ...props
}) => ( <
    ClientScript body = {
        scriptBody(props)
    }
    delay = {
        delay
    }
    />
)

export default GoogleTagManagerScripts