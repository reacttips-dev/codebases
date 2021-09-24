import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import {
  GetOrganisation,
  UpdateOrganisation
} from '../../queries/OrganisationQueries.gql'
import { FormattedMessage } from 'react-intl'

import PageTitle from '../../components/PageTitle'
import { LoadingLayout } from '../../components/Loading'
import { FieldSet, FieldGroup, Input } from '../../components/Forms'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import { Section, Lockup } from '../../components/Layout'
import useFeedback from '../../hooks/useFeedback'
import Feedback from '../../components/templates/Feedback'
import safeError from '../../utils/safeError'

const OrganisationSettings = ({
  match: {
    params: { orgId }
  }
}) => {
  const [modified, setModified] = useState(false)
  const [attributes, setAttributes] = useState({})

  const { data: organisationData, loading: loadingOrganisation } = useQuery(
    GetOrganisation,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        orgId
      }
    }
  )

  const { feedback, setFeedback, clearFeedback } = useFeedback()

  const [saveOrganisationSettings, { loading: saving }] = useMutation(
    UpdateOrganisation,
    {
      onCompleted: () => {
        setModified(false)
        setFeedback({
          type: 'success',
          message: <FormattedMessage id={'organisationSettings.success'} />,
          location: 'organisationSettings'
        })
      },
      onError: error => {
        setFeedback({
          type: 'error',
          message: safeError(error),
          location: 'organisationSettings'
        })
      }
    }
  )

  const handleUpdate = updatedOrganisationName => {
    setModified(true)
    setAttributes({ ...attributes, ...updatedOrganisationName })
  }

  const handleSubmit = event => {
    event.preventDefault()
    saveOrganisationSettings({
      variables: {
        organisation: orgId,
        attributes: attributes
      }
    })
  }

  return (
    <>
      {loadingOrganisation ? (
        <Section>
          <LoadingLayout />
        </Section>
      ) : (
        <>
          <PageTitle
            id="organisationSettings.title"
            breadcrumbs={[organisationData.organisation.name]}
          />
          <Section p={4}>
            <Breadcrumbs>
              <FormattedMessage
                id="organisationSettings.heading"
                values={{
                  organisation: organisationData.organisation.name
                }}
              />
            </Breadcrumbs>
          </Section>
          <form onSubmit={handleSubmit}>
            {feedback && feedback.location === 'organisationSettings' && (
              <Feedback
                data-qa="organisationSettingsFeedback"
                p={null}
                pt={4}
                px={4}
                pb={0}
                duration={0}
                onDismiss={() => clearFeedback()}
                {...feedback}
              />
            )}
            <Section p={4}>
              <Lockup id="organisationSettings.details" mb={0} />

              <FieldSet mb={0}>
                <FieldGroup labelid="organisationSettings.nameLabel" span={2}>
                  <Input
                    name="organisation_name"
                    defaultValue={organisationData.organisation.name}
                    required={true}
                    maxLength={30}
                    onChange={name => handleUpdate({ name })}
                    placeholder={organisationData.organisation.name}
                  />
                </FieldGroup>
              </FieldSet>

              <Button
                loading={saving}
                variant="primary"
                type="submit"
                disabled={!modified || attributes?.name === '' || saving}
              >
                <FormattedMessage id="organisationSettings.actions.save" />
              </Button>
            </Section>
          </form>
        </>
      )}
    </>
  )
}
export default OrganisationSettings
