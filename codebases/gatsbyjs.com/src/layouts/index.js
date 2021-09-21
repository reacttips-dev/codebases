/** @jsx jsx */
import { jsx } from "@emotion/core"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { Global, css } from "@emotion/core"
import { ThemeProvider } from "gatsby-interface"
import { AnonymousFeatureFlagProvider } from "@modules/featureFlags"

import config from "../config"
import { SkipNavTrigger } from "../components/shared/components/SkipNav"

import interRegularWoff2 from "../assets/fonts/inter/Inter-Regular.woff2"
import interRegularWoff from "../assets/fonts/inter/Inter-Regular.woff"

import interItalicWoff2 from "../assets/fonts/inter/Inter-Italic.woff2"
import interItalicWoff from "../assets/fonts/inter/Inter-Italic.woff"

import interBoldWoff2 from "../assets/fonts/inter/Inter-Bold.woff2"
import interBoldWoff from "../assets/fonts/inter/Inter-Bold.woff"

import futuraBoldWoff2 from "../assets/fonts/futura-pt/Webfonts/futurapt_bold/ftn85-webfont.woff2"

import "../assets/fonts/futura-pt/Webfonts/futurapt_book_macroman/stylesheet.css"
import "../assets/fonts/futura-pt/Webfonts/futurapt_demi_macroman/stylesheet.css"
import "../assets/fonts/futura-pt/Webfonts/futurapt_bold/stylesheet.css"

const globalStyles = css`
  @font-face {
    font-family: "Inter UI";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url("${interRegularWoff2}") format("woff2"),
      url("${interRegularWoff}") format("woff");
  }

  @font-face {
    font-family: "Inter UI";
    font-style: italic;
    font-weight: 400;
    font-display: swap;
    src: url("${interItalicWoff2}") format("woff2"),
      url("${interItalicWoff}") format("woff");
  }

  @font-face {
    font-family: "Inter UI";
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url("${interBoldWoff2}") format("woff2"),
      url("${interBoldWoff}") format("woff");
  }
`

function PageHelmet() {
  return (
    <Helmet
      defaultTitle={config.title}
      titleTemplate={`%s | ${config.title}`}
      htmlAttributes={{
        lang: "en",
      }}
      link={[
        {
          rel: "preload",
          as: "font",
          crossOrigin: "anonymous",
          type: `font/woff2`,
          href: futuraBoldWoff2,
        },
      ]}
      meta={[
        {
          name: `description`,
          content: config.description,
        },
        {
          name: `keywords`,
          content: config.keywords,
        },
        { name: `twitter:site`, content: config.twitter },
        { name: `og:type`, content: `website` },
        { name: `og:site_name`, content: config.title },
      ]}
    />
  )
}

const Layout = ({ children, background }) => {
  return (
    <ThemeProvider
      theme={baseTheme => ({ ...baseTheme, useColorSchemeMediaQuery: false })}
    >
      <SkipNavTrigger />
      <Global styles={globalStyles} />
      <PageHelmet />

      <div
        css={theme => ({
          background: background
            ? typeof background === `function`
              ? background(theme)
              : background
            : theme.colors.white,
          position: `relative`,
        })}
      >
        <AnonymousFeatureFlagProvider>{children}</AnonymousFeatureFlagProvider>
      </div>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  data: PropTypes.shape({
    nav: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
  page: PropTypes.object,
  location: PropTypes.object,
}

export default Layout
