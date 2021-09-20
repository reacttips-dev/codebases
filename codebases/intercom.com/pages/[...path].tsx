import { IPage } from 'marketing-site/@types/generated/contentful'
import { getAssignedVariations } from 'marketing-site/lib/abTests'
import getLocaleCodeAndPathFromUri from 'marketing-site/lib/getLocaleAndPathFromUri'
import getMarketoFormsFromPage from 'marketing-site/lib/getMarketoFormsFromPage'
import getPageByPath from 'marketing-site/lib/getPageByPath'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import Page from 'marketing-site/src/components/common/Page'
import { IAssignedVariations } from 'marketing-site/src/components/context/AssignedVariationsContext'
import { GetServerSideProps } from 'next'
import React from 'react'
import { getServerSideProps as getErrorServerSideProps } from './_error'
import { Response } from 'express'
import buildPath from 'marketing-site/lib/buildPath'
import metrics from '../server/metrics'
import { preview } from 'marketing-site/lib/env'

const allowedReferrers = [
  'https://www.intercom.com/',
  'https://marketing-site-static-staging.internal.intercom.io/',
  'https://preview.intercom.com/',
  'http://www.intercom.test/',
]

interface IProps {
  page: IPage
  assignedVariations: IAssignedVariations
}

export default function ContentfulPage({ page }: IProps) {
  return (
    <EntryMarker entry={page}>
      <Page page={page} />
    </EntryMarker>
  )
}

export const getServerSideProps: GetServerSideProps<IProps> = async function ({
  query,
  req,
  res,
  resolvedUrl,
}) {
  if (typeof query.path == 'string') {
    query.path = [query.path]
  }

  const { path, locale } = await getLocaleCodeAndPathFromUri(query.path)

  const page = await getPageByPath(path, locale)
  if (!page) {
    res.statusCode = 404
    return getErrorServerSideProps({ req, res, query: {}, resolvedUrl })
  }

  // Allow these pages to be accessed in preview mode directly from Contentful
  if (page.fields.redirectToUrl && !preview) {
    const refUrl = req.headers.referer
    const referredFromIntercom = allowedReferrers.some((allowedRef) =>
      refUrl?.startsWith(allowedRef),
    )

    if (!refUrl || !referredFromIntercom) {
      metrics.increment('redirect_invalid_referrer', { path })
      const redirectPath = buildPath({
        localeCode: locale,
        pathname: page.fields.redirectToUrl,
      }).localized
      ;(res as Response).redirect(redirectPath)
      return { props: {} as IProps }
    }
  }

  const assignedVariations = await getAssignedVariations(req, page)
  const marketoForms = await getMarketoFormsFromPage(page)

  return {
    props: { page, assignedVariations, marketoForms },
  }
}
