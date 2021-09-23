import React from 'react'

import { VStack } from '@chakra-ui/react'
import ArrowDownSLineIcon from 'remixicon-react/ArrowDownSLineIcon'

import { SpaceRole } from 'tribe-api/interfaces'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownList,
  Icon,
  Text,
} from 'tribe-components'

type SpaceRoleDropdownProps = {
  defaultValue?: SpaceRole | null
  options: SpaceRole[]
  onChange: (role: SpaceRole) => void
  memberId: string
}

export const SpaceRoleDropdown = ({
  defaultValue,
  options,
  onChange,
  memberId,
}: SpaceRoleDropdownProps) => (
  <Dropdown>
    <DropdownButton
      data-testid={`editable-member-role-${memberId}`}
      size="xs"
      rightIcon={<Icon as={ArrowDownSLineIcon} size={8} />}
      ml={-2}
      backgroundColor="transparent !important"
      textStyle="regular/small"
      textTransform="capitalize"
    >
      {defaultValue?.name}
    </DropdownButton>
    <DropdownList>
      {options
        ?.map(role => (
          <DropdownItem
            key={role?.id}
            data-testid={`member-role-${role?.type}-${memberId}`}
            onClick={() => onChange(role)}
            h="auto"
          >
            <VStack align="flex-start">
              <Text color="label.primary" textStyle="medium/medium">
                {role?.name}
              </Text>
              {role?.description && (
                <Text color="label.secondary" textStyle="regular/xsmall">
                  {role?.description}
                </Text>
              )}
            </VStack>
          </DropdownItem>
        ))
        .reverse()}
    </DropdownList>
  </Dropdown>
)
