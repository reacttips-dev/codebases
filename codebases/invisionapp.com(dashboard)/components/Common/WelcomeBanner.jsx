import React from 'react'
import PropTypes from 'prop-types'

import { Text, Button, Spaced } from '@invisionapp/helios'

import styles from '../../css/common/welcome-banner.css'

const CLOSING_TIMEOUT = 100

export default class WelcomeBanner extends React.Component {
  static propTypes = {
    continue: PropTypes.func,
    titleText: PropTypes.string,
    bodyText: PropTypes.string,
    buttonText: PropTypes.string,
    illustration: PropTypes.node
  }

  constructor (props) {
    super(props)

    this.state = {
      closing: false
    }

    this.continue = this.continue.bind(this)
  }

  continue () {
    this.setState({ closing: true })

    if (this.props.continue) {
      setTimeout(this.props.continue, CLOSING_TIMEOUT)
    }
  }

  render () {
    const illustration = React.cloneElement(
      this.props.illustration,
      { className: styles.illustration }
    )

    return (
      <div className={this.state.closing ? styles.closingContainer : ''}>
        <div onClick={this.continue} className={styles.overlay} />
        <div className={styles.bannerWrapper}>
          <Spaced top='l' bottom='l'>
            <div className={styles.bannerAlignment}>
              <Spaced right='m'>
                <div className={styles.bannerTextLeft}>
                  <Text order='title' color='text-darker'>
                    <div>{this.props.titleText}<span className={styles.welcomeBannerPeriod}>.</span></div>
                  </Text>
                  <Spaced top='s' bottom='m'>
                    <Text order='body' size='larger'>
                      <div>{this.props.bodyText}</div>
                    </Text>
                  </Spaced>
                  <Button onClick={this.continue} order='primary-alt' size='larger'>{this.props.buttonText}</Button>
                </div>
              </Spaced>
              {illustration}
            </div>
          </Spaced>
        </div>
      </div>
    )
  }
}
