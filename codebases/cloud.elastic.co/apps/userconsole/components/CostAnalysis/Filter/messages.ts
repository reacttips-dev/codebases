/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  customRange: {
    id: 'cost-analysis.filter.time-range.custom-range',
    defaultMessage: 'Custom range',
  },
  currentMonth: {
    id: 'cost-analysis.filter.time-range.current-month',
    defaultMessage: 'Current month',
  },
  lastMonth: {
    id: 'cost-analysis.filter.time-range.last-month',
    defaultMessage: 'Last month',
  },
  startDate: {
    id: 'cost-analysis.filter.start-date',
    defaultMessage: 'Start date',
  },
  endDate: {
    id: 'cost-analysis.filter.end-date',
    defaultMessage: 'End date',
  },
  deployment: {
    id: 'cost-analysis.filter.view-by-deployment',
    defaultMessage: 'Deployment',
  },
  product: {
    id: 'cost-analysis.filter.view-by-product',
    defaultMessage: 'Product',
  },
  allDeployment: {
    id: 'cost-analysis.filter.all-deployments',
    defaultMessage: 'All deployments',
  },
})
