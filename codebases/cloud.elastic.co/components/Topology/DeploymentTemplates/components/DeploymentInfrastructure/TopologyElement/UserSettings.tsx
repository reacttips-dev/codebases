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
import { FormattedMessage, MessageDescriptor } from 'react-intl'
import { EuiAccordion, EuiSpacer, EuiText, htmlIdGenerator } from '@elastic/eui'
import PrivacySensitiveContainer from '../../../../../PrivacySensitiveContainer'

import { CuiCodeEditor, CuiAlert } from '../../../../../../cui'
import { isValidYaml } from '../../../../../../lib/yaml'
import DocLink from '../../../../../DocLink'

type Props = {
  settings: string
  onChange: (value: string) => void
  isReadOnly?: boolean
  prettyName: MessageDescriptor
  fileName: string
  docLink: string
}

type State = {
  htmlId: string
}

const makeId = htmlIdGenerator()

class UserSettings extends React.Component<Props, State> {
  state = {
    htmlId: makeId(),
  }

  render(): JSX.Element {
    const { settings, onChange, isReadOnly, prettyName, fileName, docLink } = this.props

    const buttonContent = (
      <EuiText size='s'>
        <FormattedMessage
          id='deploymentInfrastructure-topologyElement-userSettings-expandButton'
          defaultMessage='Edit {fileName}'
          values={{ fileName }}
        />
      </EuiText>
    )

    return (
      <EuiAccordion
        id={this.state.htmlId}
        buttonContent={buttonContent}
        buttonClassName='euiLink euiLink--primary'
        data-test-subj='topologyElement-userSettings'
      >
        <EuiSpacer size='s' />

        <EuiText size='s' grow={true}>
          <FormattedMessage
            id='deploymentInfrastructure-topologyElement-userSettings-instructions'
            defaultMessage='Change how {prettyName} runs with your own user settings. User settings are appended to the {fileName} configuration file for your {prettyName} cluster, but not all settings are supported. {docLink}'
            values={{
              prettyName: <FormattedMessage {...prettyName} />,
              fileName,
              docLink: (
                <DocLink link={docLink}>
                  <FormattedMessage
                    id='deploymentInfrastructure-topologyElement-userSettings-instructions.learn-more'
                    defaultMessage='Learn more'
                  />
                </DocLink>
              ),
            }}
          />
        </EuiText>

        <EuiSpacer size='m' />
        <PrivacySensitiveContainer>
          <CuiCodeEditor
            language='yaml'
            value={settings}
            onChange={onChange}
            isReadOnly={isReadOnly}
          />
        </PrivacySensitiveContainer>

        {isValidYaml(settings) || (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error' data-test-subj='topologyElement-userSettings-yamlError'>
              <FormattedMessage
                id='configure-instance-user-settings.invalid-yaml'
                defaultMessage='The YAML settings are invalid, please check your syntax'
              />
            </CuiAlert>
          </Fragment>
        )}
      </EuiAccordion>
    )
  }
}

export default UserSettings
