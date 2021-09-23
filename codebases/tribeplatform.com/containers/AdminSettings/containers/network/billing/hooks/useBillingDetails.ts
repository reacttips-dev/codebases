import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  BillingDetails,
  BILLING_DETAILS,
  BillingDetailsQuery,
  BillingDetailsQueryVariables,
} from 'tribe-api'

export type UseBillingDetails = QueryResult & {
  billingDetails: BillingDetails
}

export const useBillingDetails = (): UseBillingDetails => {
  const { loading, data, error } = useQuery<
    BillingDetailsQuery,
    BillingDetailsQueryVariables
  >(BILLING_DETAILS)

  return {
    data,
    error,
    billingDetails: data?.billingDetails as BillingDetails,
    loading,
    isInitialLoading: loading && data?.billingDetails === undefined,
  }
}
