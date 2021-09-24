import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import {
  Overview as OverviewQuery,
  DeleteOrganisation as DeleteOrganisationMutation
} from '../../../queries/BillingQueries.gql'
import safeError from '../../../utils/safeError'

import { Block } from '../../../components/Layout'
import Feedback from '../../../components/templates/Feedback'
import Subscription from '../../../components/templates/Organisation/Billing/Subscription'
import Usage from '../../../components/templates/Organisation/Billing/Usage'
import Delete from '../../../components/templates/Organisation/Billing/Delete'
import PageTitle from '../../../components/PageTitle'

const Overview = ({
  match: {
    params: { orgId }
  }
}) => {
  const [feedback, setFeedback] = useState({})
  const variables = { organisation: orgId }
  const { data, loading } = useQuery(OverviewQuery, {
    variables,
    fetchPolicy: 'cache-and-network'
  })

  const [deleteOrganisation, { loading: saving }] = useMutation(
    DeleteOrganisationMutation,
    {
      onCompleted: () => (window.location = '/home'),
      onError: error => {
        setFeedback({ type: 'error', message: safeError(error) })
      }
    }
  )

  const handleDelete = () => deleteOrganisation({ variables })

  const { organisation } = data || {}
  const { subscription, name: organisationName, slug, estimatedTestsPerMonth } =
    organisation || {}
  const { status, testAllocation } = subscription || {}
  return (
    <>
      <PageTitle
        id="organisations.overview.title"
        breadcrumbs={[organisationName]}
      />
      <Block>
        {!feedback.type || (
          <Feedback
            p={0}
            pt={4}
            px={4}
            duration={0}
            onDismiss={() => setFeedback({})}
            {...feedback}
          />
        )}
        <Subscription slug={slug} {...(subscription || {})} />
        <Usage
          orgId={orgId}
          status={status}
          {...(testAllocation || {})}
          estimatedTestsPerMonth={estimatedTestsPerMonth}
          loading={loading}
        />
        <Delete
          name={organisationName}
          onDelete={handleDelete}
          loading={loading}
          saving={saving}
        />
      </Block>
    </>
  )
}

export default Overview
