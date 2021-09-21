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

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiSpacer, EuiTitle } from '@elastic/eui'

import { CuiAlert, CuiCodeEditor } from '../../../../../cui'

import { isValidYaml } from '../../../../../lib/yaml'

type Props = {
  nodeType: string
  value: string | null
  onChange: (value: string) => void
  id: string
  index: string
}

export default class ReviewYamlSettingsEditor extends Component<Props> {
  componentDidMount() {
    const { value, onChange } = this.props

    if (value === null) {
      return
    }

    onChange(value)
  }

  render() {
    const { nodeType, id, onChange, index, value } = this.props

    if (value === null) {
      return null
    }

    return (
      <Fragment>
        <EuiTitle size='s'>
          <h3>{id}</h3>
        </EuiTitle>

        <EuiSpacer size='s' />

        <CuiCodeEditor
          data-test-id={`yaml-editor-${nodeType}`}
          key={`yaml-editor-${nodeType}-${index}`}
          language='yaml'
          value={value}
          onChange={onChange}
          isReadOnly={false}
        />

        {!isValidYaml(value) && (
          <Fragment>
            <EuiSpacer size='m' />

            <CuiAlert type='error' data-test-id='yaml-error-in-user-settings'>
              <FormattedMessage
                id='edit-yaml.modal-error'
                defaultMessage='The YAML settings are invalid, please check your syntax'
              />
            </CuiAlert>
          </Fragment>
        )}

        <EuiSpacer size='m' />
      </Fragment>
    )
  }
}
