import React from "react"

export const LazyPageEditorHelper = delegated => {
  const [Component, setComponent] = React.useState(() => () => null)

  React.useEffect(() => {
    import("./PageEditorHelper.js").then(mod => {
      setComponent(() => mod.default)
    })
  }, [])

  return <Component {...delegated} />
}
