import React, { useState } from 'react'

import { HStack } from '@chakra-ui/layout'
import { Box } from '@chakra-ui/react'

import { Space } from 'tribe-api/interfaces'
import {
  Link,
  SelectOption,
  Text,
  AutocompleteMultiple,
  Avatar,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { useUserImportContext } from './UserImportContext'

export interface SpaceMultipleAutocompleteProps {
  loading?: boolean
  name: string
  onBlur: () => void
  onChange: (values: Space[]) => void
  onSearch: (term: string) => Promise<Space[]>
  options: Space[]
  value: Space[]
}

export const SpaceMultipleAutocomplete: React.FC<SpaceMultipleAutocompleteProps> = ({
  loading = false,
  onBlur,
  onChange,
  onSearch,
  options,
  value,
}) => {
  const context = useUserImportContext()
  const { t } = useTranslation()

  const [customSelect, setCustomSelect] = useState(false)

  return (
    <>
      {customSelect && (
        <AutocompleteMultiple
          loading={loading}
          onBlur={onBlur}
          onChange={onChange}
          onSearch={async input => {
            const spaces = await onSearch(input)
            return spaces.map(spaceToOption)
          }}
          optionConverter={spaceToOption}
          options={options.map(spaceToOption)}
          placeholder={t('userimport:spaces.placeholder', 'Search spaces')}
          value={value}
        />
      )}
      {!customSelect && (
        <HStack>
          {value?.length > 0 && (
            <Text>
              <Trans key="userimport:spaces.helperText">
                Newly invited members will automatically join{' '}
                {value.map(it => it.name).join(', ')}
              </Trans>
            </Text>
          )}
          {context?.hasInviteDefaultsPermission && (
            <Link
              href="#"
              color="accent.base"
              onClick={() => setCustomSelect(true)}
              data-testid="spaces-edit"
            >
              <Trans i18nKey="userimport:spaces.edit" defaults="Edit" />
            </Link>
          )}
        </HStack>
      )}
    </>
  )
}

const spaceToOption = (space: Space): SelectOption<Space> => ({
  label: space.name,
  icon: (
    <Box mr={1}>
      <Avatar src={space?.image} size="xs" name={space?.name} />
    </Box>
  ),
  value: space,
})
