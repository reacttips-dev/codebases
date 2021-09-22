import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import {
  Text,
  Spaced,
  Button,
  Flex,
  Rounded
} from '@invisionapp/helios'

import { APP_HOME_START_DESIGN_TOOL_CLICK } from '../../constants/TrackingEvents'
import { trackEvent } from '../../utils/analytics'

import styles from '../../css/home/get-inspired-bucket.css'

class GetInspiredBucket extends Component {
  static propTypes = {
    buttonText: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.any.isRequired,
    imageClass: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }

  static defaultProps = {
    onClick: () => {},
    mqs: {
      l: false
    }
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.onClick()

    trackEvent(APP_HOME_START_DESIGN_TOOL_CLICK, { selectedType: this.props.type })
  }

  render () {
    const {
      type,
      imageClass,
      icon: Icon,
      title,
      description,
      buttonText,
      href,
      mqs
    } = this.props

    return (
      <Rounded order='rounded'>
        <div className={cx(styles.bucket, styles[type], styles.withSidebar)}>
          <Flex alignItems='stretch'>
            <div className={cx(styles.imageWrapper, { [styles.imageWrapperMqsL]: mqs.l })} >
              <a href={href} target='_blank' onClick={this.handleClick}>
                <div className={cx(styles.image, imageClass)} />
              </a>
            </div>

            <div className={cx(styles.content, { [styles.contentMqsL]: mqs.l })}>
              <div className={styles.icon}><Icon /></div>
              <Spaced vertical='xxs'>
                <Text
                  order='subtitle'
                  color='text-darker'>
                  <span className={styles.title}>
                    {title}
                  </span>
                </Text>
              </Spaced>
              <Spaced bottom='xs'>
                <Text
                  order='body'
                  prose
                  size='smaller'
                  color='text-lighter'>
                  {description}
                </Text>
              </Spaced>
              <Button
                order='primary-alt'
                role='link'
                size='smaller'
                href={href}
                onClick={this.handleClick}
                target='_blank'>
                {buttonText}
              </Button>
            </div>
          </Flex>
        </div>
      </Rounded>
    )
  }
}

export default GetInspiredBucket
