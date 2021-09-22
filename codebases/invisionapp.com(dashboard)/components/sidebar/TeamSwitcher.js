import React, { Fragment, useState, useEffect, useMemo } from 'react'
import cx from 'classnames'

import { Box, Button, Text, Action, Avatar, Icon } from '@invisionapp/helios-one-web'

import {
  APP_SIDEBAR_LINK_CLICKED,
  APP_SIDEBAR_TEAMSWITCHER_OPENED,
  APP_SIDEBAR_TEAMSWITCHER_SELECTED
} from '../../constants/tracking-events'
import { POST_MESSAGE_SWITCH_TEAM } from '../../constants/post-message-types'
import { formatImage } from '../../utils/formatImage'
import { postMessage } from '../../utils/postMessage'
import styles from './css/team-switcher.css'
import { hasSidebarTeamsPages } from '../../utils/appShell'

const TeamSwitcher = props => {
  const {
    account: {
      team,
      user,
      accountRoutes,
      isLoading
    },
    initiallyOpen,
    location = '',
    isCondensed,
    isHovered,
    shouldShowHiddenUI,
    toggleTeamSettings,
    linkClicked,
    handleTrackEvent
  } = props

  const [isOpen, setIsOpen] = useState(!!initiallyOpen)

  const links = useMemo(() => {
    if (!team) {
      return []
    }
    // NOTE: As per our agreement with the Accounts teams, we want to allow admins, owners and members
    // to access /teams. In global-nav-web GET /v1/account, however, we DO NOT check for the isMember so we
    // need to infer if the user is a member by exclusion, i.e., not an admin, not an owner and not a guest
    // given there are only 5 roles available: primary owner, owner, admin, member and guest.
    const showTeamSettings = !team.isGuest
    const canViewBilling = user && user.permissions && user.permissions.canViewBilling
    const canViewAuditLog = user && user.permissions && user.permissions.canViewAuditLog
    const canChangeSettings = user && user.permissions && user.permissions.canChangeSettings
    const links = (hasSidebarTeamsPages()
      ? [
        { href: '/teams/settings', label: 'Settings', enabled: canChangeSettings },
        { href: '/integrations', label: 'Integrations', enabled: !team.isGuest },
        { href: '/billing', label: 'Billing', enabled: canViewBilling },
        { href: '/teams/audit-log', label: 'Audit Log', enabled: canViewAuditLog }
      ] : [
        { href: '/teams/people', label: 'People & Team settings', enabled: showTeamSettings, target: '_blank' }
      ])
      .filter(({ enabled }) => !!enabled)
      .map((link) => {
        let active = !!location.startsWith(link.href)

        // When on Slack, the Integrations should be active
        if (location.startsWith('/slack') && link.href === '/integrations') {
          active = true
        }

        return { ...link, active }
      })
    return links
  }, [isLoading, location])

  useEffect(() => {
    const hasAnyActiveMenuItems = links.find(link => link.active)
    if (hasAnyActiveMenuItems) {
      setIsOpen(true)
    }
  }, [links])

  useEffect(() => {
    if (isCondensed && !isHovered) {
      setIsOpen(false)
    }
  }, [isCondensed, isHovered])

  function handleClose () {
    toggleTeamSettings(false)
    setIsOpen(false)
  }

  function handleOpen () {
    toggleTeamSettings(true)
    handleTrackEvent(APP_SIDEBAR_TEAMSWITCHER_OPENED)
    setIsOpen(true)
  }

  function handleToggle () {
    if (isOpen) {
      handleClose()
    } else {
      handleOpen()
    }
  }

  const handleLinkClick = (href, label) => () => {
    handleTrackEvent(APP_SIDEBAR_LINK_CLICKED, { link_clicked: label })
    linkClicked(href)
  }

  function handleOverlayClick () {
    handleClose()
  }

  function handleSwitchClick () {
    handleTrackEvent(APP_SIDEBAR_TEAMSWITCHER_SELECTED)
    postMessage(POST_MESSAGE_SWITCH_TEAM)
  }

  function handleKeyDown (e) {
    const codes = [' ', 'Enter']
    if (codes.includes(e.key)) {
      handleToggle()
      e.preventDefault()
    }
  }

  if (isLoading) {
    return null
  }

  const teamURL = team.subdomain && (team.subdomain + '.' + window.location.host.split('.').slice(1).join('.'))
  const showSwitchTeams = user.multipleTeams
  const showSidebarFooter = showSwitchTeams || !!links.length

  const title = (
    <Box
      alignItems='center'
      justifyContent='start'
    >
      <Avatar
        className={styles.avatar}
        alt={team.name}
        size='32'
        src={formatImage(team.logo)}
      />
      <div className={styles.nameWrap}>
        <Text
          align='left'
          className={cx(styles.name, styles.truncate)}
          as='div'
          size='heading-14'
          order='subtitle'
          title={team.name}
        >
          {team.name}
        </Text>
        <Text
          align='left'
          className={cx(styles.companyUrl, styles.truncate)}
          as='div'
          size='body-11'
          color='surface-80'
          title={teamURL}
        >
          {teamURL}
        </Text>
      </div>
    </Box>
  )

  const content = showSidebarFooter ? (
    <div className={styles.contentWrap}>
      <nav className={styles.content}>
        {links.map((link, i) => (<Action
          key={i}
          as='a'
          className={cx(styles.link, { [styles.active]: link.active })}
          href={link.href}
          onClick={handleLinkClick(link.href, link.label)}
          target={link.target}
        >
          <Text
            align='left'
            as='span'
            size='heading-14'
          >
            {link.label}
          </Text>
        </Action>))}

        {showSwitchTeams &&
        <div className={cx(styles.switchTeamsWrap, styles.linkSpace)}>
          <Button
            as='a'
            className={styles.switchTeamsButton}
            href={`${accountRoutes.switchTeams}?backTo=true`}
            onClick={handleSwitchClick}
            order='secondary'
            role='button'
            size='24'
          >
                Switch teams
          </Button>
        </div>
        }
      </nav>
    </div>)
    : <Fragment />

  return <>
    <div
      className={cx(styles.overlay, {
        [styles.open]: isOpen
      })}
      onClick={handleOverlayClick}
    />
    <div className={cx(styles.root, {
      [styles.hideUi]: isCondensed && !shouldShowHiddenUI
    })}>
      <div className={styles.accordion}>
        <div className={styles.accordionItem} role='heading' aria-level='3'>
          <div
            className={styles.accordionButton}
            id='team-switcher-0'
            role='button'
            tabIndex='0'
            aria-disabled='false'
            aria-expanded={isOpen ? 'true' : 'false'}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
          >
            <Text size='body-12' color='surface-100' className={styles.accordionTitle}>
              {title}
            </Text>
            <Icon name='ChevronDown' size='24' color='surface-100' isDecorative className={cx(styles.accordionIcon, {
              [styles.accordionIconOpen]: isOpen
            })} />
          </div>
        </div>
        <div
          className={cx(styles.accordionPanel, {
            [styles.accordionPanelHide]: !isOpen
          })}
          role='region'
          aria-labelledby='team-switcher-0'
          id='team-switcher-panel-0'
        >
          {content}
        </div>
      </div>
    </div>
    </>
}

export default TeamSwitcher
