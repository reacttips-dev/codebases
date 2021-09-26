import React from 'react'
import styled from 'styled-components'
import { useRouteMatch } from 'react-router-dom'

import { TextLink } from '../Type'

const Link = styled(TextLink)`
  display: inline-block;
`

const NavigationLink = ({
  forceRefresh,
  to,
  children,
  exactMatch,
  match: paths,
  className,
  ...props
}) => {
  const match = useRouteMatch(paths || to)

  if (forceRefresh) {
    props.href = to
  } else {
    props.to = to
  }

  return (
    <Link
      {...props}
      className={`${className} ${
        (exactMatch ? match && match.isExact : match) ? 'active' : ''
      }`}
    >
      {children}
    </Link>
  )
}
NavigationLink.defaultProps = {
  variant: 'navPrimary',
  py: '15px',
  exactMatch: true
}

export default NavigationLink
