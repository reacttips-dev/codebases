import * as React from "react"
import { CacheProvider } from "@emotion/core"
import createCache from "@emotion/cache"
import { trackAutomaticPageViewed } from "./src/utils/analytics"

let originalNavigate
let hasNavigated = false

export const onClientEntry = () => {
  const polyfills = []

  // IntersectionObserver polyfill for gatsby-image (Safari, IE)
  if (typeof window.IntersectionObserver === `undefined`) {
    polyfills.push(
      import(
        /* webpackChunkName: "intersection-observer-polyfill" */ `intersection-observer`
      )
    )
  }

  // Object-fit/Object-position polyfill for gatsby-image (IE)
  const testImg = document.createElement(`img`)
  if (
    typeof testImg.style.objectFit === `undefined` ||
    typeof testImg.style.objectPosition === `undefined`
  ) {
    polyfills.push(
      import(
        /* webpackChunkName: "object-fit-polyfill", webpackExports: ["default"] */ `object-fit-images`
      ).then(mod => mod.default())
    )
  }

  // IE 11 for some reason doesn't have Number.isNan,
  // but do have global window.isNaN
  if (typeof Number.isNaN === `undefined`) {
    Number.isNaN =
      window.isNaN ||
      function(a) {
        return a
      }
  }

  // String.prototype.matchAll polyfill for @modules/locales (IE)
  if (typeof String.prototype.matchAll === `undefined`) {
    polyfills.push(
      import(
        /* webpackChunkName: "matchall-polyfill" */ `string.prototype.matchall/auto`
      )
    )
  }

  return Promise.all(polyfills)
}

export const onRouteUpdate = ({ location }) => {
  trackAutomaticPageViewed(location.pathname)

  /*
   * Begin Segment tracking
   * Modified from gatsby-plugin-segment-js: https://github.com/benjaminhoffman/gatsby-plugin-segment-js
   */

  const SEGMENT_ROUTES = [
    /dashboard.*/,
    /get-started/,
    /pricing/,
    /cloud/,
    /docs.*/,
  ]

  const matches = (pathname, expressions) => {
    return !!expressions.find(expr => expr.test(pathname))
  }

  function trackSegmentPage() {
    window.setTimeout(() => {
      window.analytics && window.analytics.page()
    }, 50)
  }

  const isMatchingRoute = matches(location.pathname, SEGMENT_ROUTES)

  if (isMatchingRoute) {
    if (window.segmentSnippetLoaded === false) {
      window.segmentSnippetLoader(() => {
        trackSegmentPage()
      })
    } else {
      trackSegmentPage()
    }
  }

  // wrap inside a timeout to ensure the title has properly been changed
  setTimeout(() => {
    if (window.dataLayer) {
      window.dataLayer.push({ event: `gatsby-route-change` })
    }
  }, 50)
}

export const wrapRootElement = ({ element }) => {
  const cache = createCache()

  return <CacheProvider value={cache}>{element}</CacheProvider>
}

function HydationMeasurer({ children }) {
  React.useEffect(() => {
    if (hasNavigated) {
      performance.measure("navigation-duration", "start-navigation")
    }
  })

  return children
}

export function wrapPageElement({ element }) {
  return <HydationMeasurer>{element}</HydationMeasurer>
}

export const onInitialClientRender = () => {
  performance.mark("gatsby-intial-hydrate")

  originalNavigate = window.___navigate
  window.___navigate = function(...props) {
    hasNavigated = true
    performance.mark("start-navigation")
    originalNavigate(...props)
  }

  const gtmScript = document.createElement("script")
  gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=GTM-N5NSCWL"
  gtmScript.onload = function() {
    // init GTM
    const dataLayer = window.dataLayer || []
    dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" })
  }

  document.head.appendChild(gtmScript)
}
