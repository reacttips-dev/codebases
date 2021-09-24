import React from 'react'

import { Link } from '@chakra-ui/react'

import { MentionBlotClassName } from 'containers/Composer/constants'

interface ComposerMentionProps {
  id: number
  text: string
}
export const ComposerMention = ({ id, text }: ComposerMentionProps) => {
  return (
    <Link
      data-type="mention"
      data-id={id}
      className={MentionBlotClassName}
      color="accent.base"
      fontSize="md"
      fontWeight="regular"
    >
      <span>{text}</span>
    </Link>
  )
}
