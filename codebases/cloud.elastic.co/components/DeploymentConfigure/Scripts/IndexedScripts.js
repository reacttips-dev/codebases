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
    id: `deployment-configure-scripts.disable-indexed-scripts`,
    defaultMessage: `Disable indexed scripts`,
  },
  enableSandboxedScripts: {
    id: `deployment-configure-scripts.enable-sandboxed-indexed-scripts`,
    defaultMessage: `Enable sandboxed indexed scripts`,
  },
  enableScripts: {
    id: `deployment-configure-scripts.enable-indexed-scripts`,
    defaultMessage: `Enable indexed scripts`,
  },
})

function IndexedScripts({ intl: { formatMessage }, onUpdate, value, lastValue }) {
  const setValue = (newValue) => onUpdate(`stored`, newValue)

  return (
    <Field layout={SimpleLayout} className='p'>
      <Label>
        <EuiTitle>
          <h4>
            <FormattedMessage
              id='deployment-configure-scripts.indexed-scripts'
              defaultMessage='Indexed Scripts'
            />
          </h4>
        </EuiTitle>
      </Label>
      <Description>
        <EuiText>
          <FormattedMessage
            id='deployment-configure-scripts.indexed-scripts-description'
            defaultMessage='Scripts can be {indexed} and referenced by their name. This is a safer option than inlining, as you can control allowed scripts by limiting access to the .scripts index with Security.'
            values={{
              indexed: (
                <em>
                  <FormattedMessage
                    id='deployment-configure-scripts.indexed-scripts-description-emphasis'
                    defaultMessage='indexed'
                  />
                </em>
              ),
            }}
          />
        </EuiText>
      </Description>
      <CompositeField>
        <EuiSpacer size='s' />

        <EuiFlexGroup gutterSize='s'>
          <EuiFlexItem grow={false}>
            <EuiRadio
              id='indexed-scripts-off'
              name='indexed-scripts'
              label={formatMessage(messages.disableScripts)}
              onChange={() => setValue(`off`)}
              checked={value === `off`}
            />
          </EuiFlexItem>

          {getTooltip(`off`, value, lastValue)}
        </EuiFlexGroup>

        <EuiSpacer size='s' />

        <EuiFlexGroup gutterSize='s'>
          <EuiFlexItem grow={false}>
            <EuiRadio
              id='indexed-scripts-sandbox'
              name='indexed-scripts'
              label={formatMessage(messages.enableSandboxedScripts)}
              onChange={() => setValue(`sandbox`)}
              checked={value === `sandbox`}
            />
          </EuiFlexItem>

          {getTooltip(`sandbox`, value, lastValue)}
        </EuiFlexGroup>

        <EuiSpacer size='s' />

        <EuiFlexGroup gutterSize='s'>
          <EuiFlexItem grow={false}>
            <EuiRadio
              id='indexed-scripts-on'
              name='indexed-scripts'
              label={formatMessage(messages.enableScripts)}
              onChange={() => setValue(`on`)}
              checked={value === `on`}
            />
          </EuiFlexItem>

          {getTooltip(`on`, value, lastValue)}
        </EuiFlexGroup>
      </CompositeField>
    </Field>
  )
}

export default injectIntl(IndexedScripts)
