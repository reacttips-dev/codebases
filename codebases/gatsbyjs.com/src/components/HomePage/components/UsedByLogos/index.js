import React from "react"
import { contentPositionerCss } from "../../../shared/styles"
import Logos from "./Logos"
import Markdown from "components/CustomPageLayout/components/Markdown"
import { normalizeData } from "../../../CustomPageLayout"
import CtaBlock from "./CtaBlock"

const rootCss = theme => [
  contentPositionerCss({ theme }),
  {
    // not magic numbers - these correspond to the grid gap defined in
    // `src/components/HomePage/index` — space.15 = 6rem
    // we want to pull up this component a little bit — it is expected to
    // follow the hero component, which we want it to be closer to
    marginTop: `-${theme.space[10]}`, // 3rem

    [theme.mediaQueries.desktop]: {
      marginTop: `-${theme.space[15]}`,
    },
  },
]

const noteCss = theme => ({
  colors: theme.colors.grey[50],
  fontSize: theme.fontSizes[0],
  textAlign: "center",

  a: {
    fontWeight: theme.fontWeights.semiBold,
  },

  [theme.mediaQueries.desktop]: {
    textAlign: "left",
  },
})

export function UsedByLogos({ data = {} }) {
  const {
    Logos: logos,
    Markdown: markdown,
    UsedByCTABlock: usedByCTABlock,
  } = normalizeData(data)

  // Use full-width layout when there is no CTA Block defined
  if (!usedByCTABlock) {
    return (
      <section css={rootCss}>
        <Markdown data={markdown} css={noteCss} />
        <Logos data={logos} />
      </section>
    )
  }

  return (
    <section css={rootCss}>
      <UsedByGrid>
        <div>
          <Markdown data={markdown} css={noteCss} />
          <Logos data={logos} />
        </div>
        <CtaBlock data={usedByCTABlock} />
      </UsedByGrid>
    </section>
  )
}

function UsedByGrid({ children }) {
  return (
    <div
      css={theme => ({
        display: "block",
        margin: `-${theme.space[5]}`,
        "& > div": {
          padding: theme.space[5],
        },
        [theme.mediaQueries.desktop]: {
          display: "flex",
          alignItems: "center",
          "& > div": {
            width: "50%",
            padding: theme.space[5],
          },
        },
      })}
    >
      {children}
    </div>
  )
}

export default UsedByLogos
