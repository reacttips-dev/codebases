import React from 'react'
import styled from 'styled-components'
import { space } from 'styled-system'

import { Section } from '../Layout'
import { transition } from '../../utils/style'

import {
  Tabs as ReachTabs,
  TabList,
  Tab as ReachTab,
  TabPanels,
  TabPanel
} from '@reach/tabs'

const Wrapper = styled.div`
  overflow-x: auto;
  white-space: nowrap;
`

const StyledTabs = styled(ReachTabs)`
  ${space}
`

const StyledTab = styled(ReachTab)`
  appearance: none;
  background: none;
  border: 0;
  border-bottom: 2px solid
    ${({ theme, active }) => (active ? theme.colors.blue300 : 'transparent')};
  color: ${({ theme, active }) =>
    active ? theme.colors.blue300 : theme.colors.grey400};
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  line-height: 1;
  margin: 0 20px;
  outline: 0;
  padding: 15px 0;
  transition: ${transition()};

  &:hover {
    border-bottom-color: ${({ theme }) => theme.colors.blue300};
    color: ${({ theme }) => theme.colors.blue300};
  }
`

const Tab = ({ isSelected, children, ...props }) => (
  <StyledTab active={isSelected ? 1 : 0} {...props}>
    {children}
  </StyledTab>
)

export { TabList, Tab, TabPanels, TabPanel }

const Tabs = ({ p, px, ...props }) => (
  <Section p={p} px={px}>
    <Wrapper>
      <StyledTabs {...props} />
    </Wrapper>
  </Section>
)

Tabs.defaultProps = {
  p: null,
  px: '10px'
}

export default Tabs
