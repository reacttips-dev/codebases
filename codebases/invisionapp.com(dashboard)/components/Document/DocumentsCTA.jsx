import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { trackEvent } from '../../utils/analytics'

import { Color, Padded, Spaced, Text } from '@invisionapp/helios'
import Button from '../Form/Button'

import styles from '../../css/home/create-cta.css'

class DocumentsCTA extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    handleCreateNewModal: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.handleCreateSpace = this.handleCreateSpace.bind(this)
    this.handleCloseCTA = this.handleCloseCTA.bind(this)
  }

  handleCreateSpace () {
    this.props.handleCreateNewModal('createSpace', true)
    trackEvent('App.Onboarding.CTA.Clicked')
  }

  handleCloseCTA () {
    trackEvent('App.Onboarding.CTA.Closed')
    this.props.actions.toggleHasSeenSpacesDocsCTA(true)
  }

  render () {
    return (
      <Padded horizontal='l' vertical='s'>
        <section className={classNames(styles.root, styles.rootLoop)}>
          <Spaced horizontal='l'>
            <div className={styles.imageLoop} />
          </Spaced>
          <Padded left='l'>
            <div className={styles.content}>
              <Spaced bottom='s'>
                <Text order='subtitle' size='larger'>
                  <h2 className={styles.title}>
                  Keep your team in the loop
                  </h2>
                </Text>
              </Spaced>
              <Spaced>
                <Text order='body' size='larger'>
                  <Color shade='lighter'>
                    <p className={styles.copy}>
                    Related documents—prototypes, boards, and freehands—can now be stored in one central space, making them easy to find and share.
                    </p>
                  </Color>
                </Text>
              </Spaced>
            </div>
          </Padded>
          <Spaced horizontal='l'>
            <Button order='secondary' onClick={this.handleCreateSpace}>Create a space</Button>
          </Spaced>
          <button className={styles.close} onClick={this.handleCloseCTA} />
        </section>
      </Padded>
    )
  }
}

export default DocumentsCTA
