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

const messages = defineMessages({
  unlockTitle: {
    id: 'trial-modal.unlock-more-features.title',
    defaultMessage: 'Unlock more features',
  },
  unlockAlt: {
    id: 'trial-modal.unlock-more-features.illustration',
    defaultMessage: `An illustration of a packed box.`,
  },
  maybeLater: {
    id: 'trial-modal.unlock-more-features.maybe-later',
    defaultMessage: `Maybe later`,
  },
})

export const moreFeatures = defineMessages({
  moreFeaturesOnes: {
    id: 'trial-modal.more-features.one',
    defaultMessage: 'Create multiple deployments',
  },
  moreFeaturesTwo: {
    id: 'trial-modal.more-features.two',
    defaultMessage: 'Scale up with more RAM and storage',
  },
  moreFeaturesThree: {
    id: 'trial-modal.more-features.three',
    defaultMessage: 'Get high availability across 3 zones',
  },
  moreFeaturesFour: {
    id: 'trial-modal.more-features.four',
    defaultMessage: 'Access to standard support',
  },
  moreFeaturesFive: {
    id: 'trial-modal.more-features.five',
    defaultMessage: 'Search across multiple deployments with cross cluster search',
  },
})

export default messages
