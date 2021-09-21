import React from "react"
import { LazyContentEditorHelper } from "./EditorHelper"
import { editorHelperActive } from "../../shared/env/constants"
import { normalizeCmsMeta } from "../helpers/normalizeCmsMeta"

const withData = Target => ({ data = {}, ...rest }) => {
  const htmlText = data.text?.text
  const tag = data.tag || `h3`
  const visuallyHidden = data.visuallyHidden || false

  const result = { htmlText, tag, visuallyHidden }

  const cms = normalizeCmsMeta(data)

  return editorHelperActive ? (
    <LazyContentEditorHelper cms={cms}>
      <Target {...result} {...rest} />
    </LazyContentEditorHelper>
  ) : (
    <Target {...result} {...rest} />
  )
}

export default withData
