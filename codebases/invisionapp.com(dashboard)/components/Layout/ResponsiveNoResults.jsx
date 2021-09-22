import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Link, Spaced, Text, Illustration, Button } from '@invisionapp/helios'

import CreateFirstDocumentSvg from '@invisionapp/helios/illustrations/scene/create-first-document.svg'
import LibrariesEmptySvg from '@invisionapp/helios/illustrations/scene/libraries-empty.svg'
import NotFoundSvg from '@invisionapp/helios/illustrations/scene/not-found.svg'
import NoSpacesToViewSvg from '@invisionapp/helios/illustrations/scene/no-spaces-to-view.svg'
import CreateFirstSpaceSvg from '@invisionapp/helios/illustrations/scene/create-first-space.svg'
import IsArchived from '@invisionapp/helios/illustrations/spot/space-has-been-archived.svg'

import {
  PAYWALL_REDIRECT,
  PAYWALL_CREATE_DOCUMENT_ACTION
} from '../../constants/PaywallTypes'
import checkPaywall from '../../utils/check-paywall'

import styles from '../../css/responsive-no-results.css'

import { DOCUMENT_CREATE_BUTTON_TEXT, SPACE_CREATE_BUTTON_TEXT } from '../../constants/RecentsConstants'
import { APP_HOME_CREATE_OPENED } from '../../constants/TrackingEvents'
import { trackEvent } from '../../utils/analytics'

const canCreate = (location, permissions) => {
  return (location === 'space' && permissions.createSpaces) || (location === 'document' && permissions.createDocuments)
}

const getImage = ({ isArchived, isFiltering, location, account }) => {
  if (isArchived) {
    return <IsArchived />
  }

  if (!canCreate(location, account.user.permissions)) {
    return <LibrariesEmptySvg />
  } else if (isFiltering) {
    return <NotFoundSvg />
  } else if (location === 'space') {
    return <NoSpacesToViewSvg />
  } else if (location === 'document') {
    return <CreateFirstDocumentSvg />
  } else {
    return <CreateFirstSpaceSvg />
  }
}

const getTitle = ({ isArchived, isFiltering, location, account }) => {
  if (isArchived) {
    return 'No archived documents'
  }

  if (!canCreate(location, account.user.permissions)) {
    return location === 'document'
      ? 'You aren\'t collaborating on any documents'
      : 'You don\'t have any spaces'
  } else {
    if (location === 'space') {
      return isFiltering
        ? `No results found`
        : `Organization that makes sense`
    }

    return isFiltering
      ? `No results found`
      : `Create your first ${location}`
  }
}

const getSubtitle = ({ isArchived, isFiltering, location, account }) => {
  if (isArchived) {
    return 'Archiving documents is a great way to reduce clutter. Once documents are archived, you can find them here.'
  }

  if (
    (location === 'space' && !account.user.permissions.createSpaces) ||
    (location === 'document' && !account.user.permissions.createDocuments)
  ) {
    return `Once you are added to a ${location} it will appear here`
  } else if (isFiltering) {
    return 'Try adjusting your search or filter to find what you’re looking for.'
  } else if (location === 'space') {
    return 'Create a space to keep related documents together, so they’re always easy to find and share.'
  }
  return 'Feeling inspired? Bring your ideas to life with InVision.'
}

class ResponsiveNoResults extends Component {
  constructor (props) {
    super(props)
    this.handleCreateClick = this.handleCreateClick.bind(this)
    this.handleOpenAddExisting = this.handleOpenAddExisting.bind(this)
    this.renderCallToAction = this.renderCallToAction.bind(this)
  }

  async handleCreateClick () {
    const paywallStatus = await checkPaywall(PAYWALL_CREATE_DOCUMENT_ACTION, this.props.paywall)
    if (paywallStatus === PAYWALL_REDIRECT) {
      return
    }

    const { viewType, actions, location } = this.props
    trackEvent(APP_HOME_CREATE_OPENED, { createContext: viewType, entrypoint: 'emptyState' })
    actions.createModalOpen(location === 'space' ? 'createSpace' : 'projectTypes')
  }

  handleOpenAddExisting = () => {
    this.props.actions.openBatchAddModal('fab')
  }

  renderCallToAction = () => {
    const { isArchived, documentCount, horizontal } = this.props
    if (isArchived) return null

    if (!documentCount || documentCount === 0) {
      return null
    }

    return (
      <div className={cx(styles.takeTheTour, { [styles.takeTheTourVertical]: !horizontal })}>
        <Link order='secondary' onClick={this.handleOpenAddExisting}>
        add existing
        </Link>
      </div>
    )
  }

  render () {
    const { documentCount, horizontal } = this.props
    const showAddExisting = !!documentCount && documentCount > 0
    return (
      <div className={cx(styles.root, { [styles.horizontalLayout]: horizontal })}>
        <Illustration className={cx(styles.illustration, { [styles.illustrationVertical]: !horizontal })} order='scene'>
          {getImage(this.props)}
        </Illustration>
        <div className={cx(styles.description, { [styles.horizontalDescription]: horizontal })}>
          <Spaced bottom='xs'>
            <Text className={styles.title} order='title' size='smaller'>
              {getTitle(this.props)}
            </Text>
          </Spaced>
          <Spaced bottom='s'>
            <Text className={styles.subtitle} order='body' size='larger'>
              {getSubtitle(this.props)}
            </Text>
          </Spaced>
          {
            !this.props.isArchived && !this.props.isFiltering &&
            canCreate(this.props.location, this.props.account.user.permissions) &&
            <div className={cx(styles.buttons, { [styles.horizontalButtons]: horizontal })}>
              <Button className={styles.startCreating} onClick={this.handleCreateClick} order='primary-alt'>
                {this.props.location === 'space' ? SPACE_CREATE_BUTTON_TEXT : DOCUMENT_CREATE_BUTTON_TEXT}
              </Button>
              {
                horizontal && showAddExisting &&
                <Text className={styles.or} order='body' size='larger'>
                  or
                </Text>
              }
              { this.renderCallToAction() }
            </div>
          }
        </div>
      </div>
    )
  }
}

ResponsiveNoResults.defaultProps = {
  account: {
    user: {
      permissions: {
        createDocuments: false,
        createSpaces: false
      }
    }
  },
  isArchived: false,
  location: 'document'
}

ResponsiveNoResults.propTypes = {
  account: PropTypes.object,
  isArchived: PropTypes.bool,
  isFiltering: PropTypes.bool,
  location: PropTypes.oneOf(['space', 'document']),
  viewType: PropTypes.string,
  paywall: PropTypes.object
}

export default ResponsiveNoResults
