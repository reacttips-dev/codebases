import React from 'react'
import PropTypes from 'prop-types'

import { Button, Fullscreen, Tooltip, Illustration, Spaced, Text } from '@invisionapp/helios'
import InVision from '@invisionapp/helios/icons/InVision'
import CouldNotLoadImage from '@invisionapp/helios/illustrations/spot/inspect-could-not-load.svg'

import styles from '../../../css/modals/error.css'

class Error extends React.Component {
  render () {
    const InvisionLogo = (
      <InVision
        category='logos'
        onClick={this.props.handleCloseModal}
        fill='text'
        size={24}
      />
    )
    return (
      <Fullscreen
        closeOnEsc
        passThrough
        open={this.props.isOpen}
        aria-label='Fullscreen error modal'
        onRequestClose={this.props.handleCloseModal}
        renderLogo={() => (
          <Tooltip
            placement='bottom'
            trigger={InvisionLogo}
          >
            Invision
          </Tooltip>
        )}
        style={{ zIndex: 20 }}
      >
        <Illustration order='scene' size='larger'>
          <CouldNotLoadImage className={styles.svgCentered} />
        </Illustration>

        <Spaced bottom='s' top='xl'>
          <Text element='h2' order='title'>
            Sorry about that
          </Text>
        </Spaced>

        <Spaced bottom='m'>
          <Text element='div' order='body'>
            {this.props.message}
          </Text>
        </Spaced>

        <Button order='primary' size='larger' onClick={this.props.handleCloseModal}>GOT IT</Button>
      </Fullscreen>
    )
  }
}

Error.propTypes = {
  handleCloseModal: PropTypes.func,
  isOpen: PropTypes.bool,
  message: PropTypes.string
}

export default Error
