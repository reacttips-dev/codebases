import React from 'react'
import styled from 'styled-components'
import {
  Menu,
  MenuButton as ReachMenuButton,
  MenuPopover,
  MenuItems,
  MenuItem,
  MenuLink
} from '@reach/menu-button'
import { positionDefault } from '@reach/popover'
import { Link } from 'react-router-dom'
import {
  buttonStyle,
  layout,
  border,
  shadow,
  space,
  typography
} from 'styled-system'

import { Heading } from '../Type'
import { Box } from '../Grid'

import { breakpoint } from '../../utils/style'

const MENU_LIST_PROPS = {
  sm: {
    min: '200px',
    max: '350px'
  },
  md: {
    min: '290px',
    max: '350px'
  },
  lg: {
    min: '500px',
    max: '500px'
  }
}

const calculateMenuPosition = ({ mobile, targetRect, popoverRect }) => {
  const defaultPosition = positionDefault(targetRect, popoverRect)

  const top = `${parseInt(defaultPosition.top, 10) + 15}px`
  if (mobile) {
    return {
      ...defaultPosition,
      top,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'scroll',
      zIndex: 10
    }
  } else {
    return {
      ...defaultPosition,
      top
    }
  }
}

export const MenuButton = styled(ReachMenuButton)`
  appearance: none;
  border: 0;
  background: none;
  line-height: 0;
  outline: 0;
  padding: 0;
`

const StyledMenuList = styled(Box)`
  max-width: 100%;
  min-width: 100%;
  outline: 0;
  position: relative;
  z-index: 4;

  [role='menu'] {
    outline: 0;
  }

  ${breakpoint(0)`
    min-width: ${({ min }) => min};
    max-width: ${({ max }) => max};
  `};
  ${space}
`
StyledMenuList.defaultProps = {
  borderRadius: '3px',
  boxShadow: 'menu',
  backgroundColor: 'white',
  width: '100%'
}

export const MenuList = ({ children, level, mobile, ...props }) => (
  <MenuPopover
    position={(targetRect, popoverRect) =>
      calculateMenuPosition({ mobile, targetRect, popoverRect })
    }
  >
    <StyledMenuList {...MENU_LIST_PROPS[level]} {...props}>
      <MenuItems>{children}</MenuItems>
    </StyledMenuList>
  </MenuPopover>
)
MenuList.defaultProps = {
  level: 'md',
  mobile: false
}

export const MenuSection = styled(Box)`
  position: relative;

  &:last-of-type {
    border-bottom: 0;
  }
`
MenuSection.defaultProps = {
  borderBottom: '1px solid',
  borderColor: 'grey100',
  p: 3
}

export const MenuOverlay = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    #ffffff 76.56%
  );
  bottom: 0;
  content: '';
  display: block;
  height: 30px;
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 1;
`

export const MenuContainer = styled(Box)`
  max-height: ${({ maxHeight }) => maxHeight};
  overflow-y: scroll;
  position: relative;
`
MenuContainer.defaultProps = {
  maxHeight: '200px'
}

export const MenuWrapper = styled.div`
  position: relative;
`

export const MenuHeading = ({ children, ...props }) => (
  <Heading {...props}>{children}</Heading>
)
MenuHeading.defaultProps = {
  ...Heading.defaultProps,
  as: 'h3',
  level: 'xs',
  color: 'grey500'
}

export const MenuAction = styled(MenuLink)`
  border: 1px solid transparent;
  border-radius: 3px;
  align-items: center;
  display: inline-block;
  outline: 0;
  cursor: pointer;
  line-height: 1;
  text-decoration: none;
  text-align: center;
  ${buttonStyle}
  ${border}
  ${space}
  ${shadow}
  ${typography}
  ${layout}
`
MenuAction.defaultProps = {
  forwardedAs: Link,
  variant: 'tertiary',
  fontSize: 0,
  fontWeight: '600',
  p: '12px 12px'
}

export { MenuPopover, MenuItems, MenuItem, MenuLink }

export default Menu
