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

import {
  // @ts-ignore missing def
  EuiCodeEditor,
} from '@elastic/eui'

import 'brace/theme/chrome'
import 'brace/theme/tomorrow_night'
import 'brace/mode/json'
import 'brace/mode/yaml'
import 'brace/ext/searchbox'

import { Theme } from '../../types'

const themes = {
  light: `chrome`,
  dark: `tomorrow_night`,
}

type Language = 'json' | 'text' | 'yaml'

interface Props {
  color?: Theme
  disabled?: boolean
  isReadOnly?: boolean
  height?: string
  language?: Language
  value?: string
  onChange?: (value: string) => void
  onEditor?: (editor: any) => void
}

const CodeEditor: FunctionComponent<Props> = ({
  color = 'light',
  language,
  value,
  onChange,
  onEditor,
  ...rest
}) => {
  const theme = themes[color]

  return (
    <EuiCodeEditor
      ref={handleRef}
      theme={theme}
      width='100%'
      mode={language}
      value={value}
      onChange={onChange}
      {...rest}
    />
  )

  function handleRef(el) {
    if (!el) {
      return
    }

    const { editor } = el.aceEditor

    onEditorDefaults(editor)

    if (onEditor) {
      onEditor(editor)
    }
  }
}

function onEditorDefaults(editor) {
  editor.setShowPrintMargin(false)
  editor.commands.removeCommands([`gotoline`])
}

export default CodeEditor
