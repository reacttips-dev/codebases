import React, { Suspense, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import { Get, Update } from '../../queries/TestProfileQueries.gql'

import PageTitle from '../../components/PageTitle'
import EditProfileTemplate from '../../components/templates/Sites/Settings/TestProfiles/Edit'
import safeError from '../../utils/safeError'
import useFeedback from '../../hooks/useFeedback'

const Feedback = React.lazy(() => import('../../components/templates/Feedback'))

const EditTestProfile = ({
  history,
  match: {
    params: { teamId, siteId, uuid }
  }
}) => {
  const intl = useIntl()
  const { setFeedback } = useFeedback()
  const [feedback, setLocalFeedback] = useState()

  const { loading, data } = useQuery(Get, {
    variables: {
      teamId,
      siteId,
      uuid
    }
  })

  const { team } = data || {}
  const { organisation, site } = team || {}
  const { name: organisationName, slug: orgId } = organisation || {}
  const { name: siteName, testProfile } = site || {}

  const [updateProfileMutation, { loading: saving }] = useMutation(Update, {
    onCompleted: () => {
      setFeedback({
        location: 'profiles',
        type: 'success',
        message: intl.formatMessage({ id: 'site.settings.profiles.success' })
      })
      history.push(`/teams/${teamId}/${siteId}/settings/profiles`)
    },
    onError: error => {
      setLocalFeedback({
        type: 'error',
        message: safeError(error)
      })
    }
  })

  const handleUpdate = attributes => {
    updateProfileMutation({
      variables: {
        orgId,
        siteId,
        uuid,
        attributes
      }
    })
  }

  const handleCancel = () =>
    history.push(`/teams/${teamId}/${siteId}/settings/profiles`)

  return (
    <>
      <PageTitle
        id="profiles.edit.title"
        breadcrumbs={[siteName, organisationName]}
      />
      {!feedback || (
        <Suspense fallback={<div />}>
          <Feedback
            {...feedback}
            p={null}
            pt={4}
            px={4}
            pb={0}
            onDismiss={() => setLocalFeedback(null)}
          />
        </Suspense>
      )}
      <EditProfileTemplate
        orgId={orgId}
        siteId={siteId}
        onUpdate={handleUpdate}
        loading={loading}
        onCancel={handleCancel}
        saving={saving}
        {...testProfile}
        connection={
          testProfile && testProfile.bandwidth && testProfile.bandwidth.tag
        }
        device={testProfile && testProfile.device && testProfile.device.tag}
      />
    </>
  )
}

export default EditTestProfile
