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
    id: `deployment-configure-scripts.disable-stored-scripts`,
    defaultMessage: `Disable stored scripts`,
  },
  enableSandboxedScripts: {
    id: `deployment-configure-scripts.enable-sandboxed-stored-scripts`,
    defaultMessage: `Enable sandboxed stored scripts`,
  },
  enableScripts: {
    id: `deployment-configure-scripts.enable-stored-scripts`,
    defaultMessage: `Enable stored scripts`,
  },
})

function InlineScripts({ intl: { formatMessage }, onUpdate, value, lastValue }) {
  const setValue = (newValue) => onUpdate(`stored`, newValue)

  return (
    <Field layout={SimpleLayout} className='p'>
      <Label>
        <EuiTitle>
          <h4>
            <FormattedMessage
              id='deployment-configure-scripts.stored-scripts'
              defaultMessage='Stored Scripts'
            />
          </h4>
        </EuiTitle>
      </Label>
      <Description>
        <EuiText>
          <FormattedMessage
            id='deployment-configure-scripts.stored-scripts-description'
            defaultMessage='Scripts can be {stored} and referenced by their name. This is a safer option than inlining, as you can control allowed scripts by limiting access to the .scripts index with Security.'
            values={{
              stored: (
                <em>
                  <FormattedMessage
                    id='deployment-configure-scripts.stored-scripts-description-emphasis'
                    defaultMessage='stored'
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
              id='stored-scripts-off'
              name='stored-scripts'
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
              id='stored-scripts-sandbox'
              name='stored-scripts'
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
              id='stored-scripts-on'
              name='stored-scripts'
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

export default injectIntl(InlineScripts)
