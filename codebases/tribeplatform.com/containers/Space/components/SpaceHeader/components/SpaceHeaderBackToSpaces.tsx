import React, { FC } from 'react'

import { HStack, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'

import { SpaceQuery } from 'tribe-api'
import { Icon, IconButton, Text } from 'tribe-components'
import { useTranslation, Trans } from 'tribe-translation'

import { getSearchParams } from 'utils/url.utils'

interface SpaceHeaderBackToSpacesProps {
  space: SpaceQuery['space']
  iconOnly?: boolean
}

export const SpaceHeaderBackToSpaces: FC<SpaceHeaderBackToSpacesProps> = ({
  space,
  iconOnly,
}) => {
  const { t } = useTranslation()

  const defaultBackLink = space?.collection?.id
    ? `/collection/${space?.collection?.id}`
    : '/spaces'

  const { from } = getSearchParams<'from'>(['from']) || {}

  return (
    <NextLink href={from || defaultBackLink} passHref>
      <Link data-testid="space-back-btn">
        <HStack cursor="pointer">
          {iconOnly ? (
            <IconButton
              icon={<ArrowLeftLineIcon size="20" />}
              aria-label={t('space:header.back', 'Back')}
              buttonType="secondary"
              backgroundColor="bg.secondary"
              borderRadius="base"
              p={0}
            />
          ) : (
            <Icon as={ArrowLeftLineIcon} color="label.secondary" size="14px" />
          )}
          {!iconOnly && (
            <Text color="label.secondary">
              <Trans i18nKey="space:header.back" defaults="Back" />
            </Text>
          )}
        </HStack>
      </Link>
    </NextLink>
  )
}
