import React from "react"

import { CustomPageLayout } from "../CustomPageLayout"
import { Fallback } from "../CustomPageLayout/components/Fallback"

import {
  PageHeader,
  CtaBlock,
  Ecosystem,
  GatsbyCloud,
  CustomerShowcase,
  GatsbyFeatures,
  GatsbySpeed,
  Testimonials,
  UsedByLogos,
} from "./components"

const components = {
  PageHeader,
  CtaBlock,
  Ecosystem,
  GatsbyCloud,
  CustomerShowcase,
  GatsbyFeatures,
  GatsbySpeed,
  Testimonials,
  UsedByLogos,
}

/**
 * @param {{ space: any[]; }} theme
 */
const rootCss = theme => ({
  display: `grid`,
  gridTemplateColumns: `minmax(0, 1fr)`,
  gap: theme.space[15],
  marginTop: theme.space[8],
})

export function HomePage({ seo, location, content }) {
  return (
    <CustomPageLayout seo={seo} location={location}>
      <div css={rootCss}>
        {content?.map(({ id, componentName, data }, idx) => {
          const Component = components[componentName] || Fallback
          return (
            <Component
              key={id}
              idx={idx}
              data={data}
              componentName={componentName}
            />
          )
        })}
      </div>
    </CustomPageLayout>
  )
}
