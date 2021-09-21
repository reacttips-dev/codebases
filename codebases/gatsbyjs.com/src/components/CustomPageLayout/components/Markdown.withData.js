import React from "react"
import { LazyContentEditorHelper } from "./EditorHelper"
import { editorHelperActive } from "../../shared/env/constants"
import { normalizeCmsMeta } from "../helpers/normalizeCmsMeta"

const withData = Target => ({ data = {}, componentName: _, ...rest }) => {
  const html = data.body?.childMarkdownRemark?.html

  const result = { html }

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
