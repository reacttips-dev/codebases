import React from "react"
import { normalizeContent } from "./helpers/normalizeContent"
import {
  EditorHelperProvider,
  LazyPageEditorHelper,
} from "./components/EditorHelper"
import { ThemeProvider } from "gatsby-interface"
import { editorHelperActive } from "../shared/env/constants"

export const withData = ({ data, location }) => Target => {
  const { contentfulCustomPage } = data

  const {
    id,
    contentful_id,
    spaceId,
    name,
    seoDescription,
    seoTitle,
    socialMediaImage,
    content: rawContent,
  } = contentfulCustomPage

  const seo = {
    title: seoTitle,
    description: seoDescription,
    socialMediaImageUrl: socialMediaImage?.file.url,
  }

  const cms = {
    spaceId,
    entryId: contentful_id,
    entryName: name,
  }

  const content = normalizeContent(rawContent)

  const result = {
    id,
    location,
    seo,
    content,
  }

  return editorHelperActive ? (
    <EditorHelperProvider>
      <ThemeProvider>
        <LazyPageEditorHelper cms={cms} />
      </ThemeProvider>
      <Target {...result} />
    </EditorHelperProvider>
  ) : (
    <Target {...result} />
  )
}
