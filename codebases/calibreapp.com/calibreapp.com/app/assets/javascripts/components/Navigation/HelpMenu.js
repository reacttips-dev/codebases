import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { variant } from 'styled-system'
import { useIntl } from 'react-intl'
import { useChat } from 'react-live-chat-loader'
import axios from 'axios'

import { MenuLinks, MenuList, MenuSection } from './Menu'
import { Flex, Box } from '../Grid'
import Text, { TextLink } from '../Type'

import useBreakpoint from '../../hooks/useBreakpoint'

const statusStyle = variant({ key: 'statusStyles', prop: 'variant' })
const indicatorStyle = variant({ key: 'indicatorStyles', prop: 'variant' })

const Indicator = styled.span`
  border-radius: 100%;
  display: inline-block;
  bottom: 2px;
  position: relative;
  height: 8px;
  width: 8px;
  ${indicatorStyle};
`

const HelpSection = styled(MenuSection)`
  ${statusStyle}
`

const Status = ({ active }) => {
  const [status, setStatus] = useState({
    indicator: 'none',
    description: 'All Systems Operational'
  })
  useEffect(() => {
    if (active)
      axios
        .get('https://kwpw55038gfh.statuspage.io/api/v2/status.json')
        .then(res => {
          setStatus(res.data.status)
        })
        .catch(() => {
          setStatus({
            indicator: 'unknown',
            description: 'Error retrieving current status'
          })
        })
  }, [active])

  return (
    <HelpSection variant={status.indicator}>
      <Flex alignItems="center">
        <Box mr="8px">
          <Indicator variant={status.indicator} />
        </Box>
        <Box>
          <TextLink
            lineHeight={1}
            variant="menu"
            href="https://calibrestatus.com"
          >
            Service Status
          </TextLink>
        </Box>
      </Flex>
      <Text level="xs" color="inherit">
        {status.description}
      </Text>
    </HelpSection>
  )
}

const HelpMenu = ({ active }) => {
  const intl = useIntl()
  const aboveMobile = useBreakpoint(0)
  const [, loadChat] = useChat()

  const MENU_LINKS = [
    {
      name: intl.formatMessage({
        id: 'navigation.menu.help.gettingStarted.title'
      }),
      description: intl.formatMessage({
        id: 'navigation.menu.help.gettingStarted.description'
      }),
      to: '/docs/get-started/guide',
      forceRefresh: true
    },
    {
      name: intl.formatMessage({
        id: 'navigation.menu.help.docs.title'
      }),
      description: intl.formatMessage({
        id: 'navigation.menu.help.docs.description'
      }),
      to: '/docs',
      forceRefresh: true
    },
    {
      name: intl.formatMessage({
        id: 'navigation.menu.help.api.title'
      }),
      description: intl.formatMessage({
        id: 'navigation.menu.help.api.description'
      }),
      to: '/docs/automation/node',
      forceRefresh: true
    },
    {
      name: intl.formatMessage({
        id: 'navigation.menu.help.contact.title'
      }),
      description: intl.formatMessage({
        id: 'navigation.menu.help.contact.description'
      }),
      to: '/contact',
      forceRefresh: true,
      onClick: event => {
        event.preventDefault()
        loadChat()
      }
    }
  ]

  return (
    <MenuList mobile={!aboveMobile} level="sm">
      <MenuSection borderBottom="none">
        <MenuLinks links={MENU_LINKS} maxHeight="100%" />
      </MenuSection>
      <Status active={active} />
    </MenuList>
  )
}

export default HelpMenu
