import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Spaced, Padded, Link, Rounded, Elevated, Text } from '@invisionapp/helios'
import InvisionLogo from '@invisionapp/helios/icons/InVision'
import GooglePlayBadge from '../../img/google-play-badge.svg'
import AppleStoreBadge from '../../img/apple-store-badge.svg'
import { trackEvent } from '../../utils/analytics'
import { APPLE_STORE, GOOGLE_PLAY_STORE } from '../../constants/AppStoreConstants'
import cx from 'classnames'
import styles from '../../css/common/mobile-warning.css'

class MobileWarningView extends PureComponent {
  handleClick = () => {
    trackEvent('App.Home.Mobile.Warning.Dismissed', { osType: this.props.osType })
    try {
      window.localStorage.setItem('mobile-warning-dimissed', 'true')
      window.location.reload()
    } catch (e) {}
  }

  launchApp = () => {
    const isAndroid = this.props.osType === 'android'
    trackEvent('App.Home.Mobile.Warning.Downloaded', { osType: this.props.osType })
    try {
      window.open(isAndroid ? GOOGLE_PLAY_STORE : APPLE_STORE, '_blank')
    } catch (e) {}
  }

  render () {
    const isAndroid = this.props.osType === 'android'
    const isIphone = this.props.osType === 'ios'
    return (
      <div className={styles.root}>
        <div className={styles.description}>
          <Spaced >
            <Elevated level='medium'>
              <Rounded order={isAndroid ? 'circled' : 'rounded'} className={cx({ [styles.rounded]: isIphone })}>
                <div className={styles.logoBox}>
                  <InvisionLogo
                    category='logos'
                    fill='white'
                    size={36}
                  />
                </div>
              </Rounded>
            </Elevated>
          </Spaced>
          <Spaced vertical='xs' top='l'>
            <Padded horizontal='s'>
              <Text className={styles.title} order='title' size='smaller'>
                Looks like you're on a mobile device.
              </Text>
            </Padded>
          </Spaced>
          <Spaced vertical='s'>
            <Padded horizontal='s'>
              <Text className={styles.innerText} order='body' size='larger'>
                This isn’t available on mobile browsers. To view prototypes and freehands on the go, download the app. For full functionality, switch to desktop.
              </Text>
            </Padded>
          </Spaced>
        </div>
        <div className={styles.ctaPanel}>
          <Spaced>
            { isAndroid && <GooglePlayBadge onClick={this.launchApp} /> }
            { isIphone && <AppleStoreBadge onClick={this.launchApp} /> }
          </Spaced>

          <Spaced top='xs'>
            <Link className={styles.link}
              onClick={this.handleClick}
              href=''
              order='secondary'
              role='link'
              element='a'>
              Enter desktop Site
            </Link>
          </Spaced>

        </div>
      </div>
    )
  }
}

MobileWarningView.propTypes = {
  osType: PropTypes.oneOf(['android', 'ios'])
}

export default MobileWarningView
