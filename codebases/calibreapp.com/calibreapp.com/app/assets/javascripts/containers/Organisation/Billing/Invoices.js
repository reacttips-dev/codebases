import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { injectIntl } from 'react-intl'

import {
  Invoices as InvoicesQuery,
  UpdateBilling as UpdateBillingMutation
} from '../../../queries/BillingQueries.gql'
import safeError from '../../../utils/safeError'

import { Block } from '../../../components/Layout'
import Feedback from '../../../components/templates/Feedback'
import Settings from '../../../components/templates/Organisation/Billing/Settings'
import History from '../../../components/templates/Organisation/Billing/History'
import PageTitle from '../../../components/PageTitle'

const Invoices = injectIntl(
  ({
    intl,
    match: {
      params: { orgId }
    }
  }) => {
    const variables = { organisation: orgId }

    const [feedback, setFeedback] = useState({})
    const { data, loading } = useQuery(InvoicesQuery, {
      variables,
      pollInterval: 10000
    })

    const [updateBilling, { loading: saving }] = useMutation(
      UpdateBillingMutation,
      {
        onCompleted: () => {
          setFeedback({
            type: 'success',
            message: intl.formatMessage({
              id: `organisations.settings.feedback.saved`
            })
          })
        },
        onError: error => {
          setFeedback({ type: 'error', message: safeError(error) })
        }
      }
    )
    const handleUpdate = billingInfo => {
      updateBilling({
        variables: {
          ...variables,
          billingInfo
        }
      })
    }

    const handleDismiss = () => setFeedback({})

    const { organisation } = data || {}
    const { name: organisationName, billingInfo } = organisation || {}

    return (
      <>
        <PageTitle
          id="organisations.invoices.title"
          breadcrumbs={[organisationName]}
        />
        <Block>
          {!feedback.type || (
            <Feedback
              p={0}
              pt={4}
              px={4}
              duration={0}
              onDismiss={handleDismiss}
              {...feedback}
            />
          )}

          <Settings
            {...billingInfo}
            onUpdate={handleUpdate}
            loading={loading}
            saving={saving}
          />

          <History {...organisation} loading={loading} />
        </Block>
      </>
    )
  }
)

export default Invoices
