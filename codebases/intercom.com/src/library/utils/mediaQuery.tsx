import React, { useEffect, useState } from 'react'
import { IMatcher, MediaContext } from './mediaStore'

interface IState {
  queryMatches: boolean | undefined
}

/**
  This higher-order component provides a single,
  SSR-friendly API for JS-based media queries.

  Any component that will need to create and listen
  to a Media Query List should be wrapped in this HOC,
  and take in whether the MQL matches or not
  as a prop, instead of controlling the MQL internally.

  Usage:
  const MySmartComponent = withMediaQuery(
    "propName",
    mediaQuery,
    MyComponent,
  );

  e.g., const HeaderNav = withMediaQuery("isMobile", mq.mobile, HeaderNavPure);

  This component's behavior can be configured by the value of the MediaContext Provider found above it in the tree.

  @deprecated `withMediaQuery` is not safe. Use `useMediaQuery` instead.
*/

export function withMediaQuery<P, T extends keyof P>(
  name: T,
  query: string,
  WrappedComponent: React.ComponentClass<P>,
): React.ComponentClass<Pick<P, Exclude<keyof P, T>>> {
  // @ts-ignore
  return class MediaQuery extends React.Component<P, IState> {
    static contextType = MediaContext

    // eslint-disable-next-line react/sort-comp
    context!: React.ContextType<typeof MediaContext>

    state = {
      queryMatches: undefined,
    }

    private m: IMatcher | undefined

    constructor(props: P) {
      super(props)

      this.updateMatches = this.updateMatches.bind(this)
    }

    UNSAFE_componentWillMount() {
      this.matcher.addListener(this.updateMatches)
    }

    componentWillUnmount() {
      this.matcher.removeListener()
    }

    private get matcher() {
      const { mediaMatcher } = this.context
      return (this.m = this.m || mediaMatcher(name as string, query))
    }

    updateMatches() {
      this.setState({
        queryMatches: this.matcher.matches(),
      })
    }

    render() {
      return <WrappedComponent {...this.props} {...{ [name]: this.matcher.matches() }} />
    }
  }
}

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(initial)

  useEffect(() => {
    const matcher = window.matchMedia(query)
    setMatches(matcher.matches)

    function checkIsSmall(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    matcher.addListener(checkIsSmall)
    return () => matcher.removeListener(checkIsSmall)
  }, [query])

  return matches
}
