import React from 'react'
import LoadingSpace from './LoadingSpace'

const loadingState = [
  { width: 300, members: 3, mockJoinTag: true },
  { width: 350, members: 2, mockJoinTag: true },
  { width: 200, members: 3, mockJoinTag: false },
  { width: 175, members: 1, mockJoinTag: true },
  { width: 200, members: 1, mockJoinTag: false },
  { width: 400, members: 4, mockJoinTag: false },
  { width: 250, members: 4, mockJoinTag: true },
  { width: 200, members: 2, mockJoinTag: false },
  { width: 250, members: 3, mockJoinTag: true },
  { width: 300, members: 3, mockJoinTag: true },
  { width: 350, members: 1, mockJoinTag: false },
  { width: 400, members: 4, mockJoinTag: false },
  { width: 250, members: 4, mockJoinTag: true },
  { width: 200, members: 2, mockJoinTag: false }
]

const LoadingSpaceItems = () => (
  <div data-testid='spaces-item-loading-state'>
    {loadingState.map((mockSpace, index) => (<LoadingSpace key={`loading-space-item-${index}`} {...mockSpace} />))}
  </div>
)

export default LoadingSpaceItems
