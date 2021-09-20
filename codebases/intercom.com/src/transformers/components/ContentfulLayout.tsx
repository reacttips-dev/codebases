import React from 'react'

import Layout from 'marketing-site/src/components/common/Layout'
import { usePage } from 'marketing-site/src/components/context/PageContext'
import { ILayout, IVariationContainer } from 'marketing-site/@types/generated/contentful'
import dynamic from 'next/dynamic'

const ContentfulVariationContainer = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulVariationContainer'))
      .ContentfulVariationContainer,
)

type Props = ILayout | IVariationContainer | {}

export const ContentfulLayout: React.FC<Props> = function ({ children, ...layout }) {
  const page = usePage()

  // Handle when the page has no layout
  if (!('sys' in layout)) {
    return <>{children}</>
  }

  const layoutClasses =
    page?.fields.behaviors?.map((behavior) => behavior.fields.identifier).join(' ') || ''

  if (layout.sys.contentType.sys.id === 'variationContainer') {
    return (
      <ContentfulVariationContainer {...(layout as IVariationContainer)}>
        {children}
      </ContentfulVariationContainer>
    )
  }

  return (
    <Layout layout={layout as ILayout} classes={layoutClasses}>
      {children}
    </Layout>
  )
}
