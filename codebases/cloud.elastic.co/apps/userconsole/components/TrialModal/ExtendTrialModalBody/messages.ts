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
  title: {
    id: 'extend-trial-modal.title',
    defaultMessage: 'Request a trial extension',
  },
  questionOne: {
    id: 'extend-trial-modal.question-one',
    defaultMessage: "What's the timeframe for your project?",
  },
  questionTwo: {
    id: 'extend-trial-modal.question-two',
    defaultMessage: 'What do you want to accomplish with this trial?',
  },
  immediately: {
    id: 'extend-trial-modal.option.immediately',
    defaultMessage: 'Immediately',
  },
  withinMonth: {
    id: 'extend-trial-modal.option.within-month',
    defaultMessage: 'Within a month',
  },
  longerThanMonth: {
    id: 'extend-trial-modal.option.longer-than-month',
    defaultMessage: 'Longer than a month',
  },
  exploring: {
    id: 'extend-trial-modal.option.exploring',
    defaultMessage: `I'm just exploring`,
  },
  extendTrial: {
    id: 'trial-modal.extend-trial',
    defaultMessage: 'Extend trial',
  },
  selectError: {
    id: 'trial-modal.extend-trial.select-error',
    defaultMessage: 'Please select an option.',
  },
  textError: {
    id: 'trial-modal.extend-trial.text-error',
    defaultMessage: 'Please fill out form.',
  },
  extendTrialNotice: {
    id: 'trial-modal.extend-trial.notice',
    defaultMessage:
      "This request will add 7 days to your trial, As a trial user, you won't be able to increase your RAM and storage, or create multiple deployments.",
  },
})

export default messages
