import React from 'react'
import moment from 'moment'
import { LoadingDots, Text } from '@invisionapp/helios'
import styled from 'styled-components'
import CrossFade from '../CrossFade'

type LastSeenProps = {
  activity: {
    userId?: number
    teamId?: string
    lastLoginAt?: string
    lastSeenIp?: string
    lastActiveAt?: string
  }
  isLoading?: boolean
}

const LastSeen = (props: LastSeenProps) => {
  const { activity, isLoading } = props

  const content = activity === undefined ? 'N/A' : moment(activity.lastActiveAt).fromNow()

  return (
    <Wrapper>
      <CrossFade fadeKey={isLoading ? 'true' : 'false'} fadeMs={150}>
        {isLoading ? (
          <StyledLoadingDots color="text" data-test-selector="loading" />
        ) : (
          <div style={{ position: 'relative' }}>
            <Text order="body" color="text" data-test-selector="last-seen">
              {content}
            </Text>
            <span className="pendo-meatball-menu-placeholder" />
          </div>
        )}
      </CrossFade>
    </Wrapper>
  )
}

const StyledLoadingDots = styled(LoadingDots)`
  opacity: 50%;
`

const Wrapper = styled.div`
  width: 100%;
  margin-right: 26px;

  .pendo-meatball-menu-placeholder {
    position: absolute;
    top: 5px;
    right: -20px;
    padding: 2px;
  }
`

// override moment relativeTime
moment.updateLocale('en', {
  relativeTime: {
    future: 'just now',
    past: '%s',
    s: 'just now',
    m: '1m ago',
    mm: '%dm ago',
    h: '1h ago',
    hh: '%dh ago',
    d: '1d ago',
    dd: '%dd ago',
    M: '1mo ago',
    MM: '%dmo ago',
    y: '1y ago',
    yy: '%dy ago'
  }
})

export default LastSeen
