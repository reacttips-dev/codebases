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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiSpacer, EuiText } from '@elastic/eui'

import InlineScripts from '../../../../../../DeploymentConfigure/Scripts/InlineScripts'
import FileScripts from '../../../../../../DeploymentConfigure/Scripts/FileScripts'
import StoredScripts from '../../../../../../DeploymentConfigure/Scripts/StoredScripts'

import Field, { CompositeField, Description, Label } from '../../../../../../Field'

import { Scripting } from '../../../../../../../types'

type Props = {
  scripting: Scripting
  originalScripting: Scripting
  onUpdate: (type: 'inline' | 'stored' | 'file', value: boolean | 'on' | 'off' | 'sandbox') => void
  hasWatcher: boolean
}

const ElasticsearchScripts5x: FunctionComponent<Props> = ({
  scripting,
  originalScripting,
  onUpdate,
  hasWatcher,
}) => {
  const { inline, stored, file } = scripting

  const { inline: originalInline, stored: originalStored, file: originalFile } = originalScripting

  const inlineScriptsDescription = (
    <FormattedMessage
      id='deployment-configure-scripts.scripts-can-be-inlined-5x'
      defaultMessage='Scripts can be {inlined} in requests, e.g. search requests. We recommend that this be set to {sandboxed} - if it is disabled then X-Pack features such as monitoring and watcher will stop working.'
      values={{
        inlined: (
          <em>
            <FormattedMessage id='deployment-configure-scripts.inlined' defaultMessage='inlined' />
          </em>
        ),
        sandboxed: (
          <em>
            <FormattedMessage
              id='deployment-configure-scripts.sandboxed'
              defaultMessage='sandboxed'
            />
          </em>
        ),
      }}
    />
  )

  return (
    <Field>
      <Label>
        <FormattedMessage id='deployment-configure-scripts.scripting' defaultMessage='Scripting' />
      </Label>
      <Description component='div' className='p'>
        <EuiText>
          <p>
            <FormattedMessage
              id='deployment-configure-scripts.intro-1'
              defaultMessage='Elasticsearch can use scripts to implement flexible ranking, filtering, faceting and more. It is important to restrict their usage, as they enable arbitrary code execution.'
            />
          </p>
          <p>
            <FormattedMessage
              id='deployment-configure-scripts.intro-scripting-5x'
              defaultMessage='There are 3 types of scripts, inline, stored and file. Below you can change the overall settings for these three. By default scripting languages painless, mustache, and expression are turned on for all three, irrespective of what you choose below. You can turn those off manually.'
            />
          </p>
        </EuiText>
        <EuiSpacer size='s' />
      </Description>
      <CompositeField>
        <InlineScripts
          onUpdate={onUpdate}
          value={inline}
          lastValue={originalInline}
          hasWatcher={hasWatcher}
          description={inlineScriptsDescription}
        />

        <FileScripts onUpdate={onUpdate} value={file} lastValue={originalFile} />

        <StoredScripts onUpdate={onUpdate} value={stored} lastValue={originalStored} />
      </CompositeField>
    </Field>
  )
}

export default ElasticsearchScripts5x
