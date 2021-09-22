import React from 'react'
import { LoadingDots, Text } from '@invisionapp/helios'
import styled from 'styled-components'
import CrossFade from '../CrossFade'

type StatusProps = {
  billableUserIds: [number]
  isLoading?: boolean
  userId: number
}

const Status = (props: StatusProps) => {
  const { billableUserIds, isLoading, userId } = props

  const isActive = (id: number) => {
    return billableUserIds.indexOf(id) !== -1
  }

  const content = isActive(userId) ? 'Activated' : 'Not activated'

  return (
    <Wrapper>
      <CrossFade fadeKey={isLoading ? 'true' : 'false'} fadeMs={150}>
        {isLoading ? (
          <StyledLoadingDots color="text" data-test-selector="loading" />
        ) : (
          <div style={{ position: 'relative' }}>
            <Text order="body" color="text" data-test-selector="status">
              {content}
            </Text>
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

export default Status
