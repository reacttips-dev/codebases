import * as React from "react"
import { Link } from "gatsby-interface"
import { activeTests } from "./utils"
import { useFlags } from "@modules/featureFlags"

/*
 look at to
 if to matches an existing rule && user is in testGroup, replace it
 put updated path in state

 if (flags[tests.startersTestGroup] && to.match(/starters/))
*/

export function SplitLink({ to, href, children, ...props }) {
  // SplitLink will be used as an alias for <a> in MDX,
  // so the component may receieve `href` instead of `to` prop

  const [path, setPath] = React.useState(to || href || "")
  const { flags } = useFlags()

  // Test for whether the path is internal or external
  const isInternal = /^\/(?!\/)/.test(path)

  React.useEffect(() => {
    // Skip if link is external
    if (!isInternal) {
      return
    }

    Object.keys(activeTests).forEach(testName => {
      if (flags[testName]) {
        setPath(
          path.replace(activeTests[testName].from, activeTests[testName].to)
        )
      }
    })
  }, [flags])

  // Fallback to original path if we don't have a variantPath (e.g. at build time)
  return isInternal ? (
    <Link to={path} {...props}>
      {children}
    </Link>
  ) : (
    <a href={path} {...props}>
      {children}
    </a>
  )
}
