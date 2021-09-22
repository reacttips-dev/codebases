import React from "react"

import {
  CustomPageLayout,
  ComponentsProvider,
  baseComponents,
} from "../CustomPageLayout"

import { contentPositionerCss } from "../shared/styles"
import { PageHeader } from "./components/PageHeader"
import { StartingPaths } from "./components/StartingPaths"

const components = {
  ...baseComponents,
}

const rootCss = theme => [
  contentPositionerCss({ theme }),
  {
    alignItems: `center`,
    display: `flex`,
    flexDirection: `column`,
    justifyContent: `center`,
    paddingTop: theme.space[7],
    paddingBottom: theme.space[6],
    position: `relative`,

    [theme.mediaQueries.desktop]: {
      paddingTop: theme.space[15],
      paddingBottom: theme.space[8],
    },
  },
]

export function GetStartedPage({ seo, location }) {
  return (
    <CustomPageLayout seo={seo} location={location}>
      <ComponentsProvider value={components}>
        <div css={rootCss}>
          <PageHeader />
          <StartingPaths />
        </div>
      </ComponentsProvider>
    </CustomPageLayout>
  )
}
