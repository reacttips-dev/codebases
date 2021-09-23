import React from 'react'

import { Icon } from 'tribe-components'

export interface UpVoteArrowProps {
  upVoted: boolean
}

const UpVoteArrow: React.FC<UpVoteArrowProps> = ({ upVoted }) => {
  return (
    <Icon
      variant="solid"
      colorScheme="gray"
      color={upVoted ? 'accent.base' : 'label.primary'}
      viewBox="0 0 12 10"
    >
      <svg
        width="12"
        height="10"
        viewBox="0 0 12 10"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5.13397 1C5.51887 0.333333 6.48113 0.333333 6.86603 1L11.1962 8.5C11.5811 9.16667 11.0999 10 10.3301 10H1.66987C0.900073 10 0.418948 9.16667 0.803848 8.5L5.13397 1Z" />
      </svg>
    </Icon>
  )
}

export default UpVoteArrow
