import React from "react"
import { LazyContentEditorHelper } from "./EditorHelper"
import { editorHelperActive } from "../../shared/env/constants"
import { normalizeCmsMeta } from "../helpers/normalizeCmsMeta"

const withData = Target => ({ data = {}, componentName: _, ...rest }) => {
  const anchorText = data.anchorText
  const linkingTo = data.href
  const target = data.target || `_self`

  const result = { anchorText, target }

  const isExternalLink = /(http(s?)):\/\//i.test(linkingTo)
  if (isExternalLink) {
    result.href = linkingTo
  } else {
    result.to = linkingTo
  }

  const isOnPageLink = /^#/.test(linkingTo)
  if (isOnPageLink) {
    result.variant = `GHOST`
    result.icon = `downward`
  }

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
