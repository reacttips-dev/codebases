import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Padded, Nav } from '@invisionapp/helios-one-web'
import { useRoute } from './hooks/useRoute'

import { APP_SIDEBAR_LINK_CLICKED } from '../../constants/tracking-events'

import styles from './css/links.css'

const Links = (props) => {
  const { links, closeSidebar, handleTrackEvent, linkClicked, isCondensed, shouldShowHiddenUI } = props
  const route = useRoute()

  let { pathname } = route

  if (pathname === '/' || pathname.startsWith('/docs')) {
    pathname = '/'
  }

  // These spaces routes get highlighted
  if (pathname === '/spaces/' || pathname === '/spaces/created-by-me' || pathname === '/spaces/all' || pathname === '/spaces/archive') {
    pathname = '/spaces'
  }

  if (pathname.startsWith('/teams/people')) {
    pathname = '/teams/people/members'
  }

  const enhancedLinks = useMemo(
    () => {
      return links.map(link => {
        const { external, ...rest } = link
        return {
          ...rest,
          onClick: () => {
            const { label, href } = link

            handleTrackEvent(APP_SIDEBAR_LINK_CLICKED, {
              link_clicked: label
            })
            if (linkClicked) linkClicked(href)
            closeSidebar()
          },
          target: external ? '_blank' : null,
          rel: external ? 'noopener noreferrer' : '',
          'data-app-shell-behavior': 'prevent-default',
          isSelected: link.href === pathname
        }
      })
    }, [links, pathname])

  return (
    <Padded x='8'>
      <div className={cx(styles.links, {
        [styles.hideUi]: isCondensed,
        [styles.showUi]: shouldShowHiddenUI
      })}>
        <Nav order='primary' links={enhancedLinks} />
      </div>
    </Padded>
  )
}

Links.propTypes = {
  account: PropTypes.object.isRequired,
  handleTrackEvent: PropTypes.func.isRequired,
  linkClicked: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired,
  location: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  isCondensed: PropTypes.bool,
  shouldShowHiddenUI: PropTypes.bool
}

Links.defaultProps = {
  links: []
}

export default Links
