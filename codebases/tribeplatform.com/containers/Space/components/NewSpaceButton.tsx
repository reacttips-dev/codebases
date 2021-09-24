import React from 'react'

import NextLink from 'next/link'
import AddFillIcon from 'remixicon-react/AddFillIcon'

import { hasActionPermission } from 'tribe-api'
import { Button, IconButton, useResponsive } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

export const NewSpaceButton = ({ collectionId }: { collectionId?: string }) => {
  const { network } = useGetNetwork()
  const { authorized: canAddSpace } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'addSpace',
  )
  const { isPhone } = useResponsive()
  const { t } = useTranslation()

  if (!canAddSpace) return null

  return (
    <NextLink
      href={`/space/create${
        collectionId ? `?collectionId=${collectionId}` : ''
      }`}
    >
      {isPhone ? (
        <IconButton
          buttonType="primary"
          aria-label={t('common:space.spaces.new', 'New space')}
          icon={<AddFillIcon size={20} />}
          borderRadius="base"
          data-testid="new-space-button"
          w={10}
          p={0}
        />
      ) : (
        <Button
          buttonType="primary"
          aria-label={t('common:space.spaces.new', 'New space')}
          leftIcon={<AddFillIcon size={16} />}
          size="sm"
          data-testid="new-space-button"
        >
          <Trans i18nKey="common:space.spaces.new" defaults="New space" />
        </Button>
      )}
    </NextLink>
  )
}
