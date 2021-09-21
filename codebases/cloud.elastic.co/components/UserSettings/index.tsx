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

import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import Feature from '../../lib/feature'

import { isFeatureActivated } from '../../store'

import Header from '../Header'
import UpdateProfile from './UpdateProfile'
import ApiKeys from '../ApiKeys'
import { userSettingsCrumbs } from '../../lib/crumbBuilder'

import './userSettings.scss'

const UserSettings: FunctionComponent = () => {
  const isRbacEnabled = isFeatureActivated(Feature.manageRbac)
  const apiKeysTitle = (
    <FormattedMessage id='user-settings.apiKeys.heading' defaultMessage='User API keys' />
  )

  return (
    <Fragment>
      <Header
        name={<FormattedMessage id='user-settings.title' defaultMessage='User settings' />}
        breadcrumbs={userSettingsCrumbs()}
      />

      {isRbacEnabled && (
        <div className='userSettings-updateProfile'>
          <UpdateProfile />
        </div>
      )}

      {isRbacEnabled && <ApiKeys eceDisplay={true} eceTitle={apiKeysTitle} />}
    </Fragment>
  )
}

export default UserSettings
