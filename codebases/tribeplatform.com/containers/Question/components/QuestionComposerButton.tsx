import React, { useCallback } from 'react'

import { useDisclosure } from '@chakra-ui/react'

import { ActionPermissions, SpaceQuery } from 'tribe-api'
import { hasActionPermission } from 'tribe-api/permissions'
import { Button } from 'tribe-components'
import { Trans } from 'tribe-translation'

import Composer from 'containers/Space/Composer'

export interface QuestionComposerButtonProps {
  space?: SpaceQuery['space'] | null
  onComposerClose?: () => void
}

export const QuestionComposerButton = ({
  space,
  onComposerClose,
}: QuestionComposerButtonProps) => {
  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]
  const { authorized: hasAddPostPermission } = hasActionPermission(
    permissions || [],
    'addPost',
  )

  const { isOpen, onClose, onToggle } = useDisclosure()
  const onCloseCallback = useCallback(() => {
    onClose()

    if (typeof onComposerClose === 'function') onComposerClose()
  }, [onClose, onComposerClose])

  if (!space || !hasAddPostPermission) {
    return null
  }

  return (
    <>
      <Button buttonType="primary" onClick={onToggle}>
        <Trans i18nKey="space:questions.new" defaults="New question" />
      </Button>

      <Composer
        space={space}
        defaultIsOpen={isOpen}
        onCloseCallback={onCloseCallback}
        showComposerCard={false}
      />
    </>
  )
}
