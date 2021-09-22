// This snippet adds protection against client-side libraries growing the amount of cookies
// to the point of causing server errors due to exceeding the limit of this nginx setting:
// http://nginx.org/en/docs/http/ngx_http_core_module.html#large_client_header_buffers
// It will check the size of our current cookies and if we are approaching our max, we will
// delete what we know to be non-essential for users falling into this edgecase.
// https://invisionapp.atlassian.net/browse/WPERF-10

// le cookie monster...
const appShell = window.inGlobalContext && window.inGlobalContext.appShell

if (appShell) {
  appShell.getFeatureContext('home').once('after:mount', function cookieSizeHelper () {
    try {
      const cookieMonster = () => {
        // We have updated our header allowance to 24k but
        // cloudflare enforces the cookie limit at 16k.
        // We want to clean up before that level so issues don't
        // happen during async calls.
        const maxBytes = 1024 * 13 // 13k

        const currentBytes = encodeURI(document.cookie).split(/%..|./).length - 1

        // Cookie name substrings that we know to be safe to delete in
        // the case of cookie overload.
        // These cookie patterns are set on the .invisionapp.com domain
        const disposableCookieNameIncludes = [
          'amplitude',
          'mp_'
        ]

        const clearCookie = name => {
          console.log('Clear Cookie: ', name)
          document.cookie = `${name}=;expires=${+new Date()};domain=.invisionapp.com;path=/`
        }

        const deleteCookies = () => {
          var cookies = document.cookie.split(';')
          cookies.forEach(cookie => {
            const name = cookie.split('=')[0]
            disposableCookieNameIncludes.forEach(function (disposableName) {
              if (name.indexOf(disposableName) > -1) {
                clearCookie(name)
              }
            })
          })
        }

        if (currentBytes > maxBytes) {
          console.log('Cookie byte size is: ', currentBytes, 'which is above the max byte size', maxBytes)
          console.log('Clearing cookies that are known to be save to clear and grow very large.')

          deleteCookies()
        }
      }
      if (window.requestIdleCallback) {
        window.requestIdleCallback(cookieMonster)
      } else {
        // 7000 seemed like a nice size number to be out of the way (hopefully) of any
        // other logic - completely arbitrary and can change for any reason.
        setTimeout(cookieMonster, 7000)
      }
    } catch (e) {
      console.error(e)
    }
  })
}
