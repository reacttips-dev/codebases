import { Heading, Text, ThemeCss } from "gatsby-interface"
import * as sanitizeHTML from "sanitize-html"
import * as React from "react"
import { Interpolation } from "@emotion/core"
import { getHtml } from "../utils"
import { ColorScheme, ColorSchemeCss } from "../color-schemes"
import { sectionCss, sectionTitleCss, heroLedeCss } from "../style-utils"

const ledeCss: ColorSchemeCss = theme => [
  heroLedeCss(theme),
  {
    color: theme.colors.grey[90],
    textAlign: "center",

    [theme.mediaQueries.desktop]: {
      margin: `0 ${theme.space[15]} ${theme.space[13]} `,
    },
  },
]

// Sets the colour of the Nth item, but repeating if there are more items than colours
const customListColors = (colors: Array<string>): Array<Interpolation> =>
  colors.map((color, index) => ({
    [`li:nth-of-type(${colors.length}n+${index + 1})::before`]: {
      backgroundColor: color,
    },
  }))

const listCss = (theme: ColorScheme, initial: number): Interpolation => ({
  width: "100%",
  color: theme.colors.grey[70],
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes[3],
  textAlign: "left",
  lineHeight: theme.lineHeights.body,
  listStyle: "none",
  counterSet: `walkthrough ${initial - 1}`,
  counterReset: "walkthrough",
  padding: 0,
  marginBottom: theme.space[7],
  marginTop: theme.space[10],
  marginLeft: "auto",
  marginRight: "auto",

  [theme.mediaQueries.phablet]: {
    transform: "translate(-11px, 0)",
  },

  strong: {
    fontWeight: theme.fontWeights.semiBold,
  },

  code: {
    fontFamily: theme.fonts.monospace,
  },

  li: {
    counterIncrement: "walkthrough",
    display: "flex",
    flexDirection: "column",
    paddingTop: 0,
    paddingBottom: theme.space[7],
    alignItems: "center",
    width: "100%",
    textAlign: "center",
    position: "relative",

    [theme.mediaQueries.phablet]: {
      alignItems: "flex-start",
      flexDirection: "row",
      textAlign: "left",
    },
  },

  "li::before": {
    content: "counter(walkthrough)",
    display: "grid",
    fontSize: theme.fontSizes[0],
    color: theme.colors.white,
    borderRadius: theme.radii[5],
    fontWeight: theme.fontWeights.semiBold,
    marginBottom: theme.space[3],
    width: theme.space[6],
    height: theme.space[6],
    backgroundColor: theme.colorScheme.dark,
    placeContent: "center",
    flexShrink: 0,
    lineHeight: theme.lineHeights.solid,
    position: "relative",
    top: theme.space[2],

    [theme.mediaQueries.phablet]: {
      marginRight: theme.space[7],
      marginBottom: "unset",
    },
  },

  "li::after": {
    [theme.mediaQueries.phablet]: {
      backgroundColor: theme.colors.blackFade[10],
      width: 1,
      content: "''",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 8,
      zIndex: -1,
      marginRight: theme.space[10],
    },
  },

  "span p:first-of-type": {
    display: "inline",
  },

  "li:first-child::after": {
    top: theme.space[2],
  },

  "li:last-child::after": {
    height: theme.space[4],
  },
})

const wrapperCss: ThemeCss = theme => ({
  width: "100%",
  maxWidth: "40rem",
  alignItems: "stretch",
  marginLeft: "auto",
  marginRight: "auto",
  // background: theme.colors.blackFade[5],
})

const headingCss: ColorSchemeCss = theme => [
  sectionTitleCss(theme),
  {
    color: theme.colorScheme.dark,
    marginBottom: theme.space[7],
    textAlign: "center",
  },
]

const timeCss: ThemeCss = theme => ({
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes[0],
  color: theme.colors.grey[50],
  paddingLeft: 16,
  marginLeft: theme.space[3],
  backgroundRepeat: "no-repeat",
  backgroundPosition: "left center",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='13' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.5 1h-3v1h3V1zm-2 6.5h1v-3h-1v3zm4.015-3.305l.71-.71a5.524 5.524 0 00-.705-.705l-.71.71A4.48 4.48 0 006 2.5 4.5 4.5 0 1010.5 7c0-1.06-.37-2.035-.985-2.805zM6 10.5A3.497 3.497 0 012.5 7c0-1.935 1.565-3.5 3.5-3.5S9.5 5.065 9.5 7 7.935 10.5 6 10.5z' fill='%23000' fill-opacity='.5'/%3E%3C/svg%3E");`,
  whiteSpace: "nowrap",
})

const calloutCss: ColorSchemeCss = theme => ({
  margin: 0,
  backgroundColor: theme.colorScheme.light,
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes[1],
  borderRadius: theme.radii[3],
  color: theme.colors.grey[70],
  display: "inline-block",
  padding: `${theme.space[5]} ${theme.space[10]}`,
  "a:link,a:visited": {
    color: theme.colorScheme.dark,
  },
  backgroundRepeat: "no-repeat",
  backgroundPosition: `${theme.space[5]} ${theme.space[5]}`,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 1.667A8.336 8.336 0 001.667 10c0 4.6 3.733 8.333 8.333 8.333S18.333 14.6 18.333 10 14.6 1.667 10 1.667zm.833 12.5H9.167v-5h1.666v5zm0-6.667H9.167V5.833h1.666V7.5z' fill='%23B17ACC'/%3E%3C/svg%3E");`,

  p: {
    margin: 0,
  },
})

export interface WalkThroughItem {
  text: string
  time?: string
}

export interface WalkThroughProps {
  heading?: string
  lede?: string
  initial?: number
  items: Array<WalkThroughItem>
  callout?: string
}

export function WalkThrough({
  heading,
  lede,
  initial = 1,
  items = [],
  callout,
}: WalkThroughProps): JSX.Element {
  return (
    <section css={sectionCss}>
      {heading ? (
        <Heading as="h1" css={headingCss}>
          {heading}
        </Heading>
      ) : null}
      {lede ? (
        <Text
          size="XL"
          css={ledeCss}
          dangerouslySetInnerHTML={{ __html: lede }}
        />
      ) : null}
      <div css={wrapperCss}>
        <ol
          css={(theme: ColorScheme) => [
            listCss(theme, initial),
            customListColors([
              theme.colors.purple[60],
              theme.colors.magenta[50],
              theme.colors.red[50],
              theme.colors.orange[60],
              theme.colors.yellow[50],
            ]),
          ]}
        >
          {items.map((item, index) => {
            return (
              <li key={`${item.text} ${index}`}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: item.text,
                  }}
                />
                {item.time ? <time css={timeCss}>{item.time}</time> : null}
              </li>
            )
          })}
        </ol>
        {callout ? (
          <Text
            size="S"
            as="div"
            css={calloutCss}
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(callout) }}
          />
        ) : null}
      </div>
    </section>
  )
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const mapWalkthroughProps = (entry: any): WalkThroughProps => {
  // Pull the Content, Items, and Appearance blocks out of the Section block that is passed in
  const { content, items: itemList = [] } = entry

  // Normalize the data
  const walkthoughContent = content || {}
  const items = itemList.map(
    (item: any): WalkThroughItem => ({
      text: getHtml(item.description),
      time: item.secondaryText,
    })
  )

  const initialStepNumber = items.length !== 0 ? items[0].primaryText : 1

  // Return props that will be passed to Walkthrough
  return {
    heading: walkthoughContent?.primaryText,
    lede: walkthoughContent?.secondaryText,
    items,
    initial: initialStepNumber,
    callout: getHtml(walkthoughContent?.description),
  }
}
