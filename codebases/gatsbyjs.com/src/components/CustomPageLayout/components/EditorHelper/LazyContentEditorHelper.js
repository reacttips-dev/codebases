import React from "react"

export const LazyContentEditorHelper = delegated => {
  const [Component, setComponent] = React.useState(() => () => null)

  React.useEffect(() => {
    import("./ContentEditorHelper.js").then(mod => {
      setComponent(() => mod.default)
    })
  }, [])

  return <Component {...delegated} />
}
