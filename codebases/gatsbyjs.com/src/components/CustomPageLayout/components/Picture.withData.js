import React from "react"
import { LazyContentEditorHelper } from "./EditorHelper"
import { editorHelperActive } from "../../shared/env/constants"
import { normalizeCmsMeta } from "../helpers/normalizeCmsMeta"

const withData = Target => ({ data = {}, ...rest }) => {
  const fluid = data.image?.fluid
  const alt = data.alternateText || ``

  const result = { fluid, alt }

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
