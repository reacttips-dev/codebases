import React from "react"
import Layout from "../../layouts"
import SEO from "../seo"
import { SkipNavTarget } from "../shared/components/SkipNav"
import { PageFooter } from "../PageFooter"
import { PageHeader } from "../PageHeader"

export function CustomPageLayout({ seo, location, children, invertHeader }) {
  return (
    <Layout>
      <SEO {...seo} url={location.href} />
      <PageHeader location={location} isInverted={invertHeader} />
      <main>
        <SkipNavTarget />
        {children}
      </main>
      <PageFooter />
    </Layout>
  )
}
