import React, { FC, useCallback } from 'react'

import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { SpaceQuery } from 'tribe-api'
import { AccordionGroup, AccordionItem, Skeleton } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'
import { useRemoveSpace } from 'containers/Space/hooks/useRemoveSpace'

import SettingsGroupHeader from '../../../components/SettingsGroupHeader'

const staticProps = {
  deleteSpaceAccordionGroup: {
    style: {
      boxShadow: 'none',
    },
  },
  deleteSpaceAccordion: {
    boxShadow: 'none',
    title: (
      <Trans
        i18nKey="admin:space.general.delete.title"
        defaults="Delete space"
      />
    ),
    headerProps: {
      border: '1px solid',
      borderColor: 'danger.base',
      borderRadius: 'base',
      'data-testid': 'delete-accordion',
    },
    iconProps: {
      transform: 'rotate(-90deg)',
    },
  },
}

interface DeleteSpaceProps {
  space: SpaceQuery['space']
}

const DeleteSpace: FC<DeleteSpaceProps> = ({ space }) => {
  const { removeSpace } = useRemoveSpace(space)
  const router = useRouter()
  const { network } = useGetNetwork()

  const showConfirmation = useCallback(async () => {
    const confirmed = await removeSpace()

    if (!confirmed) return

    router.push('/spaces')
  }, [removeSpace, router])

  return (
    <Box>
      <SettingsGroupHeader>
        <Trans i18nKey="admin:space.general.danger" defaults="Danger zone" />
      </SettingsGroupHeader>
      <Skeleton>
        <AccordionGroup {...staticProps.deleteSpaceAccordionGroup}>
          <AccordionItem
            bg="danger.lite"
            bgColor="danger.lite"
            onClick={showConfirmation}
            subtitle={
              <Trans
                i18nKey="admin:space.general.delete.description"
                defaults="Delete this space from {{ networkName }}"
                values={{ networkName: network?.name }}
              />
            }
            {...staticProps.deleteSpaceAccordion}
          />
        </AccordionGroup>
      </Skeleton>
    </Box>
  )
}

export default DeleteSpace
