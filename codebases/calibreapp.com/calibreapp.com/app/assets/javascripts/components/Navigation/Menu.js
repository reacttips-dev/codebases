import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { space } from 'styled-system'
import VisuallyHidden from '@reach/visually-hidden'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import Menu, {
  MenuButton as DefaultMenuButton,
  MenuItem,
  MenuList,
  MenuSection,
  MenuWrapper,
  MenuContainer,
  MenuOverlay,
  MenuHeading,
  MenuLink as DefaultMenuLink,
  MenuAction
} from '../Menu'
import { CheckIcon, SwitcherIcon } from '../Icon'
import { Box } from '../Grid'
import Loader from '../Loader'
import Text from '../Type'

import { linkStyle, transition } from '../../utils/style'
import useMutationObserver from '../../hooks/useMutationObserver'

export const MenuButton = styled(DefaultMenuButton)`
  color: ${({ theme }) => theme.colors.blue100};
  ${transition('color')};

  &.active,
  &:focus,
  &:hover {
    color: ${({ theme }) => theme.colors.white};

    * {
      stroke: ${({ theme }) => theme.colors.blue300};
      ${transition('stroke')};
    }
  }
`

const StyledMenuLink = styled(DefaultMenuLink)`
  display: block;
  line-height: 1.1;

  &[data-selected] > * {
    color: ${({ theme }) => theme.colors.blue300};
  }

  ${linkStyle}
  ${space}
`

export const MenuLink = ({ active, children, to, forceRefresh, ...props }) => {
  if (forceRefresh) {
    props.forwardedAs = 'a'
    props.href = to
  } else {
    props.forwardedAs = Link
    props.to = to
  }

  return (
    <StyledMenuLink {...props} className={active ? 'active' : null}>
      {children}
      {active ? <CheckIcon verticalAlign="middle" ml="8px" mt="-2px" /> : null}
    </StyledMenuLink>
  )
}
MenuLink.defaultProps = {
  variant: 'menu',
  mt: '15px'
}

export const MenuInput = styled(DefaultMenuLink)`
  border: 1px solid transparent;
  background: none;
  display: block;
  outline: 0;
  padding: 0;
  width: 100%;

  &[data-selected] {
    input {
      border-color: ${({ theme }) => theme.colors.blue200};
    }
  }
`
MenuInput.defaultProps = {
  forwardedAs: 'button'
}

export const DropdownButton = props => (
  <MenuButton {...props}>
    <VisuallyHidden>Actions</VisuallyHidden>
    <SwitcherIcon aria-hidden />
  </MenuButton>
)

export const MenuLinks = ({
  title,
  links,
  loading,
  maxHeight,
  hasMore,
  onLoadMore,
  onSelect
}) => {
  const [withMouse, setWithMouse] = useState(false)
  const containerRef = useRef()
  const handleFocus = mutationRecords => {
    if (withMouse) return
    const mutation = mutationRecords.find(
      record => record.target.dataset.selected === ''
    )
    if (mutation) containerRef.current.scrollTo(0, mutation.target.offsetTop)
  }
  useMutationObserver(containerRef, handleFocus)

  return (
    <MenuWrapper>
      <MenuContainer
        maxHeight={maxHeight}
        ref={containerRef}
        onMouseEnter={() => withMouse || setWithMouse(true)}
      >
        {title ? (
          <>
            {/*eslint-disable-next-line @typescript-eslint/no-empty-function*/}
            <MenuItem disabled={true} onSelect={() => {}}>
              <MenuHeading>{title}</MenuHeading>
            </MenuItem>
          </>
        ) : null}
        {loading ? (
          <>
            {/*eslint-disable-next-line @typescript-eslint/no-empty-function*/}
            <MenuItem disabled={true} onSelect={() => {}}>
              <Box my={2}>
                <Loader size="small" />
              </Box>
            </MenuItem>
          </>
        ) : null}
        {loading
          ? null
          : links.map(
              (
                { id, name, description, to, forceRefresh, ...props },
                index
              ) => (
                <MenuLink
                  key={to}
                  to={to}
                  onSelect={() => onSelect && onSelect({ name, to, id })}
                  onChange={handleFocus}
                  forceRefresh={forceRefresh}
                  mt={!title && index === 0 ? 0 : '15px'}
                  {...props}
                >
                  {name}
                  {description ? (
                    <Text level="xs" color="grey300">
                      <br />
                      {description}
                    </Text>
                  ) : null}
                </MenuLink>
              )
            )}
        {loading ? null : hasMore ? (
          <MenuAction
            forwardedAs="button"
            onClick={e => {
              e.preventDefault()
              onLoadMore()
            }}
            my="10px"
            mx="auto"
            width={1}
          >
            <FormattedMessage id="menu.load_more" />
          </MenuAction>
        ) : null}
        {links.length > 6 ? <Box height="24px" /> : null}
      </MenuContainer>
      {links.length > 6 ? <MenuOverlay /> : null}
    </MenuWrapper>
  )
}

export { MenuList, MenuSection, MenuAction }

export default Menu
