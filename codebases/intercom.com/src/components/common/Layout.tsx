import {
  IBasicHeader,
  IFixedFooterWithColumns,
  IFooter2,
  IHeaderNavigation,
  ILayout,
  IPaidLandingPageFooter,
  IVariationContainer,
} from 'marketing-site/@types/generated/contentful'
import Intercom from 'marketing-site/src/components/common/Intercom'
import SkipToContent from 'marketing-site/src/components/common/SkipToContent'
import dynamic from 'next/dynamic'
import React from 'react'

const ContentfulRooflineBanner = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulRooflineBanner'))
      .ContentfulRooflineBanner,
)
const ContentfulHeaderNavigation = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulHeaderNavigation'))
      .ContentfulHeaderNavigation,
)
const ContentfulBasicHeader = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulBasicHeader'))
      .ContentfulBasicHeader,
)
const ContentfulVariationContainer = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulVariationContainer'))
      .ContentfulVariationContainer,
)
const ContentfulPaidLandingPageFooter = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulPaidLandingPageFooter'))
      .ContentfulPaidLandingPageFooter,
)
const ContentfulFooter = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulFooter')).ContentfulFooter,
)
const ContentfulFixedFooterWithColumns = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulFixedFooterWithColumns'))
      .ContentfulFixedFooterWithColumns,
)

export interface IProps {
  children: React.ReactNode
  classes?: string
  layout: ILayout
}

function renderHeader(layout: ILayout): React.ReactNode {
  if (layout.fields.navigation) {
    const headerId = layout.fields.navigation.sys.contentType.sys.id

    if (headerId === 'headerNavigation') {
      return <ContentfulHeaderNavigation {...(layout.fields.navigation as IHeaderNavigation)} />
    } else if (headerId === 'basicHeader') {
      return <ContentfulBasicHeader {...(layout.fields.navigation as IBasicHeader)} />
    } else if (headerId === 'variationContainer') {
      return <ContentfulVariationContainer {...(layout.fields.navigation as IVariationContainer)} />
    }
    // add any other headers here
  }
}

type FooterType = IFooter2 | IPaidLandingPageFooter | IFixedFooterWithColumns

function isFooter2(footer: FooterType): footer is IFooter2 {
  return footer.sys.contentType.sys.id === 'footer2'
}

function isPaidLandingPageFooter(footer: FooterType): footer is IPaidLandingPageFooter {
  return footer.sys.contentType.sys.id === 'paidLandingPageFooter'
}

function isFixedFooterWithColumns(footer: FooterType): footer is IFixedFooterWithColumns {
  return footer.sys.contentType.sys.id === 'fixedFooterWithColumns'
}

function renderFooter(layout: ILayout): React.ReactNode {
  const { footer } = layout.fields
  if (footer) {
    if (isFooter2(footer)) {
      return <ContentfulFooter {...footer} />
    } else if (isPaidLandingPageFooter(footer)) {
      return <ContentfulPaidLandingPageFooter {...footer} />
    } else if (isFixedFooterWithColumns(footer)) {
      return <ContentfulFixedFooterWithColumns {...footer} />
    }

    // add any other footers here
  }
}

const Layout: React.FC<IProps> = ({ children, classes, layout }) => {
  return (
    <div id="layout-wrapper" className={classes}>
      {layout.fields.notificationBanner && (
        <ContentfulRooflineBanner {...layout.fields.notificationBanner} />
      )}

      <SkipToContent label={layout.fields.skipToContentLabel} />

      {renderHeader(layout)}

      <main id="main" tabIndex={-1}>
        {children}
        <Intercom hideMessenger={layout.fields.hideMessenger} />
      </main>

      {renderFooter(layout)}
    </div>
  )
}

export default Layout
