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
import jif from 'jif'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiRadio,
  EuiSpacer,
  EuiText,
  EuiTextColor,
  EuiTitle,
} from '@elastic/eui'

import { getTooltip } from './utility'

import Field, { CompositeField, Description, Label, SimpleLayout } from '../../Field'

const messages = defineMessages({
  disableScripts: {
    id: `deployment-configure-scripts.disable-inline-scripts`,
    defaultMessage: `Disable inline scripts`,
  },
  enableSandboxedScripts: {
    id: `deployment-configure-scripts.enable-sandboxed-inline-scripts-2x`,
    defaultMessage: `Enable sandboxed inline scripts`,
  },
  enableScripts: {
    id: `deployment-configure-scripts.enable-all-inline-scripts-not-recommended`,
    defaultMessage: `Enable all inline scripts (Not recommended)`,
  },
})

function InlineScripts({
  intl: { formatMessage },
  onUpdate,
  value,
  lastValue,
  hasWatcher,
  description,
}) {
  const setValue = (value) => onUpdate(`inline`, value)

  return (
    <Field layout={SimpleLayout} className='p'>
      <Label>
        <EuiTitle>
          <h4>
            <FormattedMessage
              id='deployment-configure-scripts.inline-scripts'
              defaultMessage='Inline Scripts'
            />
          </h4>
        </EuiTitle>
      </Label>
      <Description>
        <EuiText>{description}</EuiText>
      </Description>

      <CompositeField>
        <EuiSpacer size='s' />

        <EuiFlexGroup gutterSize='s'>
          <EuiFlexItem grow={false}>
            <EuiRadio
              id='inline-scripts-off'
              name='inline-scripts'
              label={formatMessage(messages.disableScripts)}
              onChange={() => setValue(`off`)}
              checked={value === `off`}
              disabled={hasWatcher}
            />
          </EuiFlexItem>

          {getTooltip(`off`, value, lastValue)}
        </EuiFlexGroup>

        {jif(hasWatcher, () => (
          <EuiFormHelpText>
            <EuiTextColor color='warning'>
              <FormattedMessage
                id='deployment-configure-scripts.disable-inline-scripts-watcher-active'
                defaultMessage='Inline scripts cannot be disabled when Watcher is active.'
              />
            </EuiTextColor>
          </EuiFormHelpText>
        ))}

        <EuiSpacer size='s' />

        <EuiFlexGroup gutterSize='s'>
          <EuiFlexItem grow={false}>
            <EuiRadio
              id='inline-scripts-sandbox'
              name='inline-scripts'
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
              id='inline-scripts-all'
              name='inline-scripts'
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

export default injectIntl(InlineScripts)
