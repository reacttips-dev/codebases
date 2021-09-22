import React, { useState } from 'react'
import styled from 'styled-components'
import { Dropdown, IconButton } from '@invisionapp/helios'
import { MoreVertical } from '@invisionapp/helios/icons'
import { MenuItem } from '@invisionapp/helios/components/Menu'
import { HeliosTheme } from '@invisionapp/helios/css/theme'
import DelayRender from '../DelayRender'

type GeneralChangesDropdownProps = {
  items: MenuItem[]
  visible?: boolean
}

const GeneralChangesDropdown = (props: GeneralChangesDropdownProps) => {
  const { items = [], visible = false } = props
  const [forceOpen, setForceOpen] = useState(false)

  return (
    <DelayRender>
      <StyledDropdown
        aria-label="General Changes Dropdown"
        className="general-changes-dropdown"
        onChangeVisibility={({ OPEN = false }) => setForceOpen(OPEN)}
        visible={visible || forceOpen}
        trigger={
          <StyledIconButton withTooltip={false}>
            <MoreVertical fill="text" size={24} />
          </StyledIconButton>
        }
        items={items}
        align="right"
        unstyledTrigger
        closeOnClick
      >
        {null}
      </StyledDropdown>
    </DelayRender>
  )
}

type StyledDropdownProps = GeneralChangesDropdownProps & {
  theme?: HeliosTheme
}

const StyledDropdown = styled(Dropdown)<StyledDropdownProps>`
  position: absolute;
  right: 7px; /* I can't use the theme.spacing here */
  height: 36px;
  align-self: center;
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: opacity 150ms linear;
`

// this is used to hide the 3 meatball menu behind the dropdown menu
const StyledIconButton = styled(IconButton)`
  z-index: ${props => props.theme?.zindex.base};
`

export default GeneralChangesDropdown
