import React, { Component } from 'react'

import { Button, Dialog, List, Spaced, Text } from '@invisionapp/helios'
import Illustration from '@invisionapp/helios/illustrations/scene/no-spaces-to-view.svg'

import { APP_SPACE_MIGRATED_DOCS_VIEWED } from '../../../constants/TrackingEvents'
import { trackEvent } from '../../../utils/analytics'
import styles from '../../../css/modals/migrated-docs.css'

export default class MigratedDocs extends Component {
  componentDidMount () {
    trackEvent(APP_SPACE_MIGRATED_DOCS_VIEWED)
  }

  onCloseModal = () => {
    this.props.actions.closeModal()
  }

  render () {
    return (
      <Dialog
        maxWidth={600}
        open
      >
        <Spaced bottom='l'>
          <Illustration height='174px' />
        </Spaced>
        <Spaced bottom='m'>
          <Text order='title' size='smaller' element='div' color='text'>Manage migrated documents</Text>
        </Spaced>
        <Spaced bottom='m'>
          <List
            className={styles.list}
            color='text-lighter'
            order='unordered'
            size='larger'
            items={[
              `Documents that were not previously added to a space have been added into this area.`,
              `You can move related documents out of this space and into new spaces to organize your work.`,
              `Everyone who had full visibility into team projects has been invited to this space.`
            ]}
          />
        </Spaced>
        <Button onClick={this.onCloseModal} className={styles.button} order='primary-alt' role='button'>Got it</Button>
      </Dialog>
    )
  }
}
