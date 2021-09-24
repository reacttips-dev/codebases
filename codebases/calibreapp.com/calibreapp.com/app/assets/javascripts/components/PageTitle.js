import React from 'react'
import { useIntl } from 'react-intl'
import { Helmet } from 'react-helmet'

const PageTitle = ({ id, values, breadcrumbs }) => {
  const intl = useIntl()
  const title = intl.formatMessage({ id, defaultMessage: ' ' }, values)
  const breadcrumbsTitle = (breadcrumbs || [])
    .filter(breadcrumb => breadcrumb && breadcrumb.length)
    .join(' - ')
  const pageTitle = title.length > 1 ? `${title} -` : ''

  return (
    <Helmet>
      <title>
        {pageTitle} {breadcrumbsTitle} {breadcrumbsTitle.length ? ' - ' : ''}{' '}
        Calibre
      </title>
    </Helmet>
  )
}

PageTitle.defaultProps = {
  id: 'pageTitle.default',
  breadcrumbs: []
}

export default PageTitle
