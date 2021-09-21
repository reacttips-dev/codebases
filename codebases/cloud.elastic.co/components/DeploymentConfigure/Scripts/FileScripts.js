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

import React from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiRadio, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui'

import { getTooltip } from './utility'

import Field, { CompositeField, Description, Label, SimpleLayout } from '../../Field'

const messages = defineMessages({
  disableScripts: {
    id: `deployment-configure-scripts.disable-file-scripts`,
    defaultMessage: `Disable file scripts`,
  },
  enableSandboxedScripts: {
    id: `deployment-configure-scripts.enable-sandboxed-file-scripts`,
    defaultMessage: `Enable sandboxed file scripts`,
  },
  enableScripts: {
    id: `deployment-configure-scripts.enable-file-scripts`,
    defaultMessage: `Enable file scripts`,
  },
})

function FileScripts({ intl: { formatMessage }, onUpdate, value, lastValue }) {
  const setValue = (value) => onUpdate(`file`, value)

  return (
    <Field layout={SimpleLayout} className='p'>
      <Label>
        <EuiTitle>
          <h4>
            <FormattedMessage
              id='deployment-configure-scripts.file-scripts'
              defaultMessage='File Scripts'
            />
          </h4>
        </EuiTitle>
      </Label>
      <Description>
        <EuiText>
          <FormattedMessage
            id='deployment-configure-scripts.file-scripts.description'
            defaultMessage='Scripts can be stored on disk and referenced by their name. This is a safer option than inlining, as only those who can upload bundles can define scripts.'
          />
        </EuiText>
      </Description>
      <CompositeField>
        <EuiSpacer size='s' />

        <EuiFlexGroup gutterSize='s'>
          <EuiFlexItem grow={false}>
            <EuiRadio
              id='file-scripts-off'
              name='file-scripts'
              onChange={() => setValue(`off`)}
              checked={value === `off`}
              label={formatMessage(messages.disableScripts)}
            />
          </EuiFlexItem>

          {getTooltip(`off`, value, lastValue)}
        </EuiFlexGroup>

        <EuiSpacer size='s' />

        <EuiFlexGroup gutterSize='s'>
          <EuiFlexItem grow={false}>
            <EuiRadio
              id='file-scripts-sandbox'
              name='file-scripts'
              onChange={() => setValue(`sandbox`)}
              checked={value === `sandbox`}
              label={formatMessage(messages.enableSandboxedScripts)}
            />
          </EuiFlexItem>

          {getTooltip(`sandbox`, value, lastValue)}
        </EuiFlexGroup>

        <EuiSpacer size='s' />

        <EuiFlexGroup gutterSize='s'>
          <EuiFlexItem grow={false}>
            <EuiRadio
              id='file-scripts-on'
              name='file-scripts'
              onChange={() => setValue(`on`)}
              checked={value === `on`}
              label={formatMessage(messages.enableScripts)}
            />
          </EuiFlexItem>

          {getTooltip(`on`, value, lastValue)}
        </EuiFlexGroup>
      </CompositeField>
    </Field>
  )
}

export default injectIntl(FileScripts)
