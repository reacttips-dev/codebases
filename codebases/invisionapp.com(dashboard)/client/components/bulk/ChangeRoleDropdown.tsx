import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Dropdown } from '@invisionapp/helios'
import { Role, RoleId, selectAllowedRoles } from '../../stores/roles'

export const isSelected = (selectedRoles: number[], roleId: RoleId) =>
  selectedRoles.length > 1 && selectedRoles.includes(roleId)

export const isDisabled = (selectedRoles: number[], roleId: RoleId) =>
  selectedRoles.length === 1 && selectedRoles[0] === roleId

// Unable to import this from Helios
type DropdownState = {
  OPEN?: boolean
}

type ChangeRoleDropdownProps = {
  onRoleChange: (roleId: RoleId) => void
  onChangeVisibility: (state: DropdownState) => void
  disabled?: boolean
  selectedRoles: number[]
}

const ChangeRoleDropdown = (props: ChangeRoleDropdownProps) => {
  const { onRoleChange, onChangeVisibility, disabled, selectedRoles } = props

  const allowedRoles = useSelector(selectAllowedRoles)

  const disabledRoles = allowedRoles.reduce((obj, role) => {
    return {
      ...obj,
      [role.id]: isDisabled(selectedRoles, role.id)
    }
  }, {} as { [id: string]: boolean })

  const dropdownItems = allowedRoles.map((role: Role) => {
    return {
      label: role.name,
      type: 'item',
      onClick: () => !disabledRoles[role.id] && onRoleChange(role.id),
      selected: isSelected(selectedRoles, role.id),
      disabled: disabledRoles[role.id]
    }
  })

  return (
    <StyledDropdown
      aria-label="Change role"
      trigger="Change role"
      // @ts-ignore - ignoring because the types are wrong in Helios
      items={dropdownItems}
      closeOnClick
      tooltipChevron="center"
      placement="top"
      align="center"
      tooltipPlacement="top"
      onChangeVisibility={onChangeVisibility}
      disabled={disabled}
    />
  )
}

// current version of Helios shows selected li with a gray bg, we want it always white
const StyledDropdown = styled(Dropdown)`
  align-self: center;
`

export default ChangeRoleDropdown
