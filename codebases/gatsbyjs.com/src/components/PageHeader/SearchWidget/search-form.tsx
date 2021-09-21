/** @jsx jsx */
import { jsx } from "theme-ui"
import * as React from "react"
import { Link, navigate } from "gatsby"
import { createPortal } from "react-dom"

import { Global } from "@emotion/core"
import { useDocSearchKeyboardEvents, DocSearchProps } from "@docsearch/react"

import algoliaGlobals from "./algolia-styles"
import { Theme } from "gatsby-interface"

let DocSearchModal: typeof import("@docsearch/react").DocSearchModal

const apiKey = `71af1f9c4bd947f0252e17051df13f9c`
const indexName = `gatsbyjs`

const Hit: DocSearchProps["hitComponent"] = function Hit({ hit, children }) {
  return <Link to={hit.url}>{children}</Link>
}

const navigator: DocSearchProps["navigator"] = {
  navigate({ itemUrl }) {
    navigate(itemUrl)
  },
}

const algoliaTheme = (t: Theme) => ({
  ".DocSearch": {
    "--docsearch-primary-color": t.colors.purple[60],
    "--docsearch-highlight-color": t.colors.purple[60],
    "--docsearch-hit-color": t.colors.grey[90],
    "--docsearch-hit-height": "75px",
    "--docsearch-hit-background": t.colors.grey[10],
    "--docsearch-hit-shadow": "none",
    "--docsearch-modal-background": "white",
  },
})

function SearchForm({
  isVisible,
  setClosed,
  shouldLoadJS,
  currentSection,
}: {
  isVisible: boolean
  shouldLoadJS: boolean
  setClosed: () => void
  currentSection?: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [initialQuery, setInitialQuery] = React.useState(undefined)
  const searchButtonRef = React.useRef(null)
  const importDocSearchModalIfNeeded = React.useCallback(async () => {
    if (DocSearchModal as unknown) {
      return
    }

    return Promise.all([
      import("@docsearch/react"),
      import("@docsearch/react/style"),
    ]).then(([{ DocSearchModal: Modal }]) => {
      DocSearchModal = Modal
    })
  }, [])

  React.useEffect(() => {
    if (shouldLoadJS) {
      importDocSearchModalIfNeeded()
    }
  }, [shouldLoadJS])

  const onOpen = React.useCallback(
    (open = true) => {
      if (!open) {
        setIsOpen(false)
        return
      }
      importDocSearchModalIfNeeded().then(() => {
        setIsOpen(true)
      })
    },
    [importDocSearchModalIfNeeded, setIsOpen]
  )

  React.useEffect(() => {
    if (!isVisible) {
      onOpen(false)
      return
    }
    onOpen(true)
  }, [onOpen, isVisible])

  const onClose = React.useCallback(() => {
    setClosed()
  }, [setIsOpen])
  const onInput = React.useCallback(
    event => {
      importDocSearchModalIfNeeded().then(() => {
        setIsOpen(true)
        setInitialQuery(event.key)
      })
    },
    [importDocSearchModalIfNeeded, setIsOpen, setInitialQuery]
  )

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  })

  const placeholder =
    currentSection === "docs" ? `Search Gatsby docs` : `Search Gatsbyjs.com`

  return (
    <form onSubmit={e => e.preventDefault()}>
      <Global styles={algoliaGlobals} />
      <Global styles={algoliaTheme} />

      {isOpen &&
        createPortal(
          <DocSearchModal
            onClose={onClose}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            navigator={navigator}
            apiKey={apiKey}
            indexName={indexName}
            placeholder={placeholder}
            // transformItems={transformItems}
            hitComponent={Hit}
            // resultsFooterComponent={resultsFooterComponent}
            // transformSearchClient={transformSearchClient}
            // {...props}
            searchParameters={
              currentSection === "docs"
                ? {
                    facetFilters: ["hierarchy.lvl0:Documentation"],
                  }
                : null
            }
          />,
          document.body
        )}
    </form>
  )
}

export default SearchForm
