import React, { Suspense, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import NewPage from '../../components/templates/Sites/Settings/Pages/New'
import PageTitle from '../../components/PageTitle'
import safeError from '../../utils/safeError'
import useFeedback from '../../hooks/useFeedback'

const Feedback = React.lazy(() => import('../../components/templates/Feedback'))

import {
  New,
  CreatePage as CreatePageMutation
} from '../../queries/PageQueries.gql'

const CreatePage = ({
  match: {
    params: { teamId, siteId }
  },
  history
}) => {
  const intl = useIntl()
  const { setFeedback } = useFeedback()
  const [localFeedback, setLocalFeedback] = useState()

  const { data } = useQuery(New, { variables: { siteId, teamId } })
  const { team } = data || {}
  const { organisation, site } = team || {}
  const { name: organisationName, slug: orgId } = organisation || {}
  const { name: siteName } = site || {}

  const [savePage, { loading }] = useMutation(CreatePageMutation, {
    onError: error => {
      setLocalFeedback({
        type: 'error',
        message: safeError(error)
      })
    },
    onCompleted: () => {
      setFeedback({
        location: 'pages',
        type: 'success',
        message: intl.formatMessage({ id: 'site.settings.pages.new.success' })
      })
      history.push(`/teams/${teamId}/${siteId}/settings/pages`)
    }
  })

  const handleCreate = attributes =>
    savePage({ variables: { orgId, siteId, attributes } })

  const handleCancel = () =>
    history.push(`/teams/${teamId}/${siteId}/settings/pages`)

  return (
    <>
      <PageTitle
        id="site.settings.pages.new.title"
        breadcrumbs={[siteName, organisationName]}
      />
      {!localFeedback || (
        <Suspense fallback={<div />}>
          <Feedback {...localFeedback} />
        </Suspense>
      )}
      <NewPage
        orgId={orgId}
        loading={loading}
        onCreate={handleCreate}
        onCancel={handleCancel}
      />
    </>
  )
}

export default CreatePage
