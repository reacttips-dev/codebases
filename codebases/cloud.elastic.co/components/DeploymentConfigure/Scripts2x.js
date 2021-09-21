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
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { EuiText } from '@elastic/eui'

import InlineScripts from './Scripts/InlineScripts'
import FileScripts from './Scripts/FileScripts'
import IndexedScripts from './Scripts/IndexedScripts'
import { mapToString } from './Scripts/utility'

import Field, { CompositeField, Description, Label } from '../Field'

function Scripts2x({ scripting, lastScripting = {}, onUpdate, hasWatcher }) {
  const inline = mapToString(scripting.inline)
  const stored = mapToString(scripting.stored)
  const file = mapToString(scripting.file)

  const lastInline = mapToString(lastScripting.inline)
  const lastStored = mapToString(lastScripting.stored)
  const lastFile = mapToString(lastScripting.file)

  const inlineScriptsDescription = (
    <FormattedMessage
      id='deployment-configure-scripts.scripts-can-be-inlined-2x'
      defaultMessage='Scripts can be {inlined} in requests, e.g. search requests. We recommend disabling this, or at most enabling {sandboxed}.'
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
              id='deployment-configure-scripts.intro-scripting-2x'
              defaultMessage='When enabling sandboxed scripts, the "expression" and "mustache" languages will be enabled. When enabling all scripts, Groovy and any language provided by plugins will be available.'
            />
          </p>
        </EuiText>
      </Description>
      <CompositeField>
        <InlineScripts
          onUpdate={onUpdate}
          value={inline}
          lastValue={lastInline}
          hasWatcher={hasWatcher}
          description={inlineScriptsDescription}
        />

        <FileScripts onUpdate={onUpdate} value={file} lastValue={lastFile} />

        <IndexedScripts onUpdate={onUpdate} value={stored} lastValue={lastStored} />
      </CompositeField>
    </Field>
  )
}

const ScriptType = PropTypes.shape({
  enabled: PropTypes.bool.isRequired,
  sandbox_mode: PropTypes.bool.isRequired,
})

const ScriptingType = PropTypes.shape({
  inline: ScriptType.isRequired,
  stored: ScriptType.isRequired,
  file: ScriptType.isRequired,
})

Scripts2x.propTypes = {
  scripting: ScriptingType.isRequired,
  lastScripting: ScriptingType,
  onUpdate: PropTypes.func.isRequired,
  hasWatcher: PropTypes.bool.isRequired,
}

export default Scripts2x
