import React, { Suspense } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { FormattedMessage } from 'react-intl'

import {
  Get,
  UpdateSiteSettings,
  UpdateSecret,
  DeleteSite
} from '../../queries/SiteQueries.gql'

import PageTitle from '../../components/PageTitle'
import { Strong } from '../../components/Type'

import SiteTemplate from '../../components/templates/Sites/Settings/Site'

import safeError from '../../utils/safeError'
import useFeedback from '../../hooks/useFeedback'

const Feedback = React.lazy(() => import('../../components/templates/Feedback'))

const EditSite = ({
  history,
  match: {
    params: { teamId, siteId }
  }
}) => {
  const { feedback, setFeedback } = useFeedback()

  const variables = { teamId, siteId }
  const { loading, data } = useQuery(Get, {
    variables,
    fetchPolicy: 'cache-and-network'
  })
  const { team } = data || {}
  const { organisation, site } = team || {}
  const { name: organisationName, slug: orgId } = organisation || {}
  const { name } = site || {}

  const [updateSiteSettingsMutation, { loading: savingSettings }] = useMutation(
    UpdateSiteSettings,
    {
      onCompleted: () => {
        setFeedback({
          location: 'editSite',
          type: 'success',
          message: <FormattedMessage id="site.settings.general.success" />
        })
      },
      onError: error => {
        setFeedback({
          location: 'editSite',
          type: 'error',
          message: safeError(error)
        })
      }
    }
  )

  const updateSettings = attributes => {
    updateSiteSettingsMutation({
      variables: {
        orgId,
        siteId,
        attributes
      }
    })
  }

  const [updateSecretMutation, { loading: savingSecret }] = useMutation(
    UpdateSecret,
    {
      onCompleted: () => {
        setFeedback({
          location: 'editSite',
          type: 'success',
          message: (
            <FormattedMessage id="site.settings.general.secret.success" />
          )
        })
      },
      onError: error => {
        setFeedback({
          location: 'editSite',
          type: 'error',
          message: safeError(error)
        })
      }
    }
  )

  const updateSecret = () =>
    updateSecretMutation({
      variables: {
        orgId,
        siteId
      }
    })

  const [updateSiteTeaMutation, { loading: savingTeam }] = useMutation(
    UpdateSiteSettings,
    {
      onCompleted: ({
        updateSiteSettings: {
          name,
          team: { slug, name: teamName }
        }
      }) => {
        setFeedback({
          location: 'sites',
          type: 'success',
          message: (
            <FormattedMessage
              id="site.settings.general.team.success"
              values={{
                site: <Strong color={'green400'}>{name}</Strong>,
                team: <Strong color={'green400'}>{teamName}</Strong>
              }}
            />
          )
        })
        history.push(`/teams/${slug}`)
      },
      onError: error => {
        setFeedback({
          location: 'editSite',
          type: 'error',
          message: safeError(error)
        })
      }
    }
  )

  const updateTeam = team => {
    updateSiteTeaMutation({
      variables: {
        orgId,
        siteId,
        attributes: {
          team
        }
      }
    })
  }

  const [deleteSiteMutation, { loading: deletingSite }] = useMutation(
    DeleteSite,
    {
      onCompleted: () => {
        setFeedback({
          location: 'sites',
          type: 'success',
          message: (
            <FormattedMessage id="site.settings.general.delete.success" />
          )
        })
        history.push(`/teams/${teamId}`)
      },
      onError: error => {
        setFeedback({
          location: 'editSite',
          type: 'error',
          message: safeError(error)
        })
      }
    }
  )

  const deleteSite = () =>
    deleteSiteMutation({
      variables: {
        orgId,
        siteId
      }
    })

  return (
    <>
      <PageTitle
        id="site.settings.general.title"
        breadcrumbs={[name, organisationName]}
      />
      {feedback?.location === 'editSite' && (
        <Suspense fallback={<div />}>
          <Feedback
            {...feedback}
            p={null}
            pt={4}
            px={4}
            pb={0}
            onDismiss={() => setFeedback(null)}
          />
        </Suspense>
      )}
      <SiteTemplate
        teamId={teamId}
        {...site}
        loading={loading}
        savingSettings={savingSettings}
        onUpdateSettings={updateSettings}
        onUpdateTeam={updateTeam}
        onDelete={deleteSite}
        deletingSite={deletingSite}
        onUpdateSecret={updateSecret}
        savingSecret={savingSecret}
        savingTeam={savingTeam}
      />
    </>
  )
}

export default EditSite
