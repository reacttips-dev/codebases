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

import { connect } from 'react-redux'

import HotWarmNotification from './HotWarmNotification'

import { dismissNotification } from '../../../../actions/notificationMessages'

import { getNotificationsState } from '../../../../reducers'

import { getProfile } from '../../reducers'

import { getConfigForKey } from '../../../../selectors'

import { showHotWarmNotification } from '../../lib/notifications'

import { HOT_WARM_CHANGES_STORAGE_KEY } from '../../../../types'

const mapStateToProps = (state) => {
  const isHeroku = getConfigForKey(state, `APP_FAMILY`) === `heroku`
  const { profile } = state

  return {
    notificationMessage: getNotificationsState(state, HOT_WARM_CHANGES_STORAGE_KEY),
    profile: getProfile(state),
    notificationEligible: showHotWarmNotification(profile, isHeroku),
  }
}

const mapDispatchToProps = (dispatch) => ({
  dismissNotification: () => dispatch(dismissNotification(HOT_WARM_CHANGES_STORAGE_KEY)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HotWarmNotification)
