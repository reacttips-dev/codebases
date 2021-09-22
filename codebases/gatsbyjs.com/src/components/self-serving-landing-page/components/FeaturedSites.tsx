import * as React from "react"
import { ContentfulSelfServicePageContent } from "../constants"
import { ColorSchemeCss } from "../color-schemes"
import { sectionCss } from "../style-utils"
import { FeaturedSitesGrid } from "../../../templates/showcase/featured-sites"

export interface FeaturedSitesProps {
  sites: Array<ContentfulSelfServicePageContent>
}

const containerCss: ColorSchemeCss = theme => ({
  // background: theme.colors.blackFade[5],
  paddingLeft: theme.space[7],
  paddingRight: theme.space[7],
  position: `relative`,
})

export function FeaturedSites({ sites = [] }: FeaturedSitesProps): JSX.Element {
  return (
    <section
      css={theme => [
        sectionCss(theme),
        {
          overflowX: "hidden",
        },
      ]}
    >
      <div css={containerCss}>
        <FeaturedSitesGrid
          featured={sites}
          hideShowcaseLink={true}
          setFilterToFeatured={null}
          setFilters={null}
          useModals={false}
        />
      </div>
    </section>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapFeaturedSitesProps = (entry: any): FeaturedSitesProps => {
  // Pull the Items blocks out of the Section block that is passed in
  const { items } = entry
  const sites = items || []
  // Return the props that will be passed to FeaturedSites
  return {
    sites,
  }
}
