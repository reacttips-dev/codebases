import { IPage } from 'marketing-site/@types/generated/contentful'
import buildPath from 'marketing-site/lib/buildPath'
import PageBehaviors from 'marketing-site/lib/page-behaviors/PageBehaviors'
import { renderBodyContent } from 'marketing-site/lib/render'
import FaviconLinks from 'marketing-site/src/components/common/FaviconLinks'
import LocaleLinks from 'marketing-site/src/components/common/LocaleLinks'
import SEOMetadata, { ISeoProps } from 'marketing-site/src/components/common/SEOMetadata'
import CurrentLocaleContext from 'marketing-site/src/components/context/CurrentLocaleContext'
import CurrentPathContext from 'marketing-site/src/components/context/CurrentPathContext'
import EditingContext from 'marketing-site/src/components/context/EditingContext'
import PageContext from 'marketing-site/src/components/context/PageContext'
import { ContentfulLayout } from 'marketing-site/src/transformers/components/ContentfulLayout'
import { transformSeoMetadata } from 'marketing-site/src/transformers/SEOMetadata'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { ChatWithUsProvider } from '../context/ChatWithUsContext'
import { MediaProvider } from '../context/MediaContext'
import GtmTrackingInitializer from './GtmTrackingInitializer'

interface IProps {
  page: IPage
  seo?: ISeoProps
  title?: string
  children?: React.ReactNode
}

export function Page({ page, children, seo, title }: IProps) {
  const { fields } = page
  const locale = useContext(CurrentLocaleContext)
  const router = useRouter()
  const showEditing = process.env.EDITOR_UI === 'true' && !!router.query.editing

  const renderPage = () => (
    <PageContext.Provider value={page}>
      <CurrentPathContext.Provider
        value={buildPath({ localeCode: locale.code, pathname: fields.path, preserveQuery: true })}
      >
        <EditingContext.Provider value={showEditing}>
          <ChatWithUsProvider>
            <GtmTrackingInitializer />
            <MediaProvider>
              <PageBehaviors pageBehaviors={fields.behaviors || []}>
                <ContentfulLayout {...fields.layout}>
                  <Head>
                    <title>{title || fields.title}</title>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                  </Head>
                  <FaviconLinks />
                  <LocaleLinks />
                  <SEOMetadata {...transformSeoMetadata(fields.seoMetadata)} {...seo} />
                  {children ? children : renderBodyContent(fields.bodyContent)}
                </ContentfulLayout>
              </PageBehaviors>
            </MediaProvider>
          </ChatWithUsProvider>
        </EditingContext.Provider>
      </CurrentPathContext.Provider>
    </PageContext.Provider>
  )

  return renderPage()
}

export default Page
