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

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { get } from 'lodash'
import jif from 'jif'

import { EuiCode, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui'

import { CuiAlert, CuiCodeEditor } from '../../cui'

import { CompositeField } from '../Field'
import DocLink from '../DocLink'

import untab from '../../lib/untab'
import { planPaths } from '../../config/clusterPaths'

function ExtraUserSettings({ plan, updatePlan, error }) {
  const defaultText = untab(`
    # Note that the syntax for user settings can change between major versions.
    # You might need to update these user settings before performing a major version upgrade.
    #
    # Slack integration for versions 7.0 and later must use the secure key store method. 
    # For more information, see:
    # https://www.elastic.co/guide/en/elasticsearch/reference/current/actions-slack.html#configuring-slack
    #    
    # Slack integration example (for versions after 5.0 and before 7.0)
    # xpack.notification.slack:
    #   account:
    #     monitoring:
    #       url: https://hooks.slack.com/services/T0A6BLEEA/B0A6D1PRD/XYZ123
    #
    # Slack integration example (for versions before 5.0)
    # watcher.actions.slack.service:
    #   account:
    #     monitoring:
    #       url: https://hooks.slack.com/services/T0A6BLEEA/B0A6D1PRD/XYZ123
    #       message_defaults:
    #        from: Watcher
    #
    # HipChat and PagerDuty integration are also supported. To learn more, see the documentation.
  `)

  function onUserSettingsChange(newUserSettings) {
    updatePlan(planPaths.extraUserSettingsSource, newUserSettings)
  }

  const extraUserSettings = get(plan, planPaths.extraUserSettingsSource, defaultText)

  return (
    <Fragment>
      <EuiTitle size='xs'>
        <h3>
          <FormattedMessage
            id='deployment-configure-extra-user-settings-source.title'
            defaultMessage='User settings'
          />
        </h3>
      </EuiTitle>

      <CompositeField>
        <EuiText grow={true}>
          <FormattedMessage
            id='deployment-configure-extra-user-settings-source.description-paragraph-1'
            defaultMessage='Change how Elasticsearch runs with your own user settings. User settings are appended to the {esYaml} configuration file for your Elasticsearch cluster, but not all settings are supported. To learn more, see {docs}.'
            values={{
              esYaml: <EuiCode>elasticsearch.yml</EuiCode>,
              docs: (
                <DocLink link='esUserSettingsDocLink'>
                  <FormattedMessage
                    id='deployment-configure-extra-user-settings-source.description-docs-link'
                    defaultMessage='documentation'
                  />
                </DocLink>
              ),
            }}
          />
        </EuiText>

        <EuiSpacer size='m' />

        <CuiCodeEditor language='yaml' value={extraUserSettings} onChange={onUserSettingsChange} />

        {jif(error, () => (
          <div>
            <EuiSpacer size='m' />

            <CuiAlert type='error' className='extraUserSettingsYaml-error'>
              {error}
            </CuiAlert>
          </div>
        ))}
      </CompositeField>
    </Fragment>
  )
}

ExtraUserSettings.propTypes = {
  plan: PropTypes.object.isRequired,
  updatePlan: PropTypes.func.isRequired,
}

export default ExtraUserSettings
