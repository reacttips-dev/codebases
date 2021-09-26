import React, { Suspense } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import { List, Delete, Update } from '../../queries/TestProfileQueries.gql'

import ProfilesTemplate from '../../components/templates/Sites/Settings/TestProfiles'
import PageTitle from '../../components/PageTitle'

import useFeedback from '../../hooks/useFeedback'
import safeError from '../../utils/safeError'

const Feedback = React.lazy(() => import('../../components/templates/Feedback'))

const Profiles = ({
  match: {
    params: { teamId, siteId }
  }
}) => {
  const { feedback, setFeedback, clearFeedback } = useFeedback()
  const intl = useIntl()
  const { loading, data } = useQuery(List, {
    variables: { teamId, siteId },
    fetchPolicy: 'cache-and-network'
  })

  const { team } = data || {}
  const { site, organisation } = team || {}
  const { name: organisationName, slug: orgId } = organisation || {}
  const { name: siteName, testProfiles = [], testProfilesAllowed = 5 } =
    site || {}

  const [updateProfileMutation] = useMutation(Update, {
    onError: error =>
      setFeedback({
        location: 'profiles',
        type: 'error',
        message: safeError(error)
      })
  })

  const [deleteProfileMutation] = useMutation(Delete, {
    onCompleted: () =>
      setFeedback({
        location: 'profiles',
        type: 'success',
        message: intl.formatMessage({
          id: 'site.settings.profiles.delete.success'
        })
      }),
    onError: error =>
      setFeedback({
        location: 'profiles',
        type: 'error',
        message: safeError(error)
      })
  })

  const deleteProfile = ({ uuid }) =>
    deleteProfileMutation({
      variables: { orgId, siteId, uuid },
      optimisticResponse: {
        __typename: 'Mutation',
        updateTestProfile: {
          id: uuid,
          __typename: 'TestProfile',
          deleted: true
        }
      }
    })

  const updateProfilePosition = ({ profile, position }) =>
    updateProfileMutation({
      variables: {
        orgId,
        siteId,
        uuid: profile,
        attributes: { position }
      }
    })

  return (
    <>
      <PageTitle
        id="profiles.title"
        breadcrumbs={[siteName, organisationName]}
      />
      {(feedback.location === 'profiles' && (
        <Suspense fallback={<div />}>
          <Feedback
            p={0}
            px={4}
            pt={4}
            duration={0}
            onDismiss={clearFeedback}
            {...feedback}
          />
        </Suspense>
      )) ||
        null}
      <ProfilesTemplate
        loading={loading}
        teamId={teamId}
        siteId={siteId}
        profiles={testProfiles}
        onUpdatePosition={updateProfilePosition}
        onDelete={deleteProfile}
        profileLimit={testProfilesAllowed}
      />
    </>
  )
}

export default Profiles
