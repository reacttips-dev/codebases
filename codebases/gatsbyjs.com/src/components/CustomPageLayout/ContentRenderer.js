import React from "react"
import { Fallback } from "./components/Fallback"
import { ComponentsContext } from "./ComponentsProvider"

export function ContentRenderer({ content, contextStyles, contextProps }) {
  const components = React.useContext(ComponentsContext)

  if (!content) {
    return null
  }

  return (
    <React.Fragment>
      {content.map(({ id, componentName, data }, idx) => {
        const Component = components[componentName] || Fallback
        const itemContextStyles = contextStyles && contextStyles[componentName]
        const itemContextProps = contextProps && contextProps[componentName]

        return (
          <Component
            key={id}
            idx={idx}
            data={data}
            componentName={componentName}
            css={itemContextStyles}
            {...itemContextProps}
          />
        )
      })}
    </React.Fragment>
  )
}
