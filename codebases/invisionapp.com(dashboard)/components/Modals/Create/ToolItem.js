import React, { Fragment } from 'react'
import { any, bool, func, string } from 'prop-types'
import cx from 'classnames'

import PlayIcon from '../../../img/play-button.svg'
import { Button, Color, Padded, Spaced, Text } from '@invisionapp/helios'

import downloadStyles from '../../../css/modals/download-tools.css'
import typeStyles from '../../../css/modals/project-types.css'

export default class ToolItem extends React.PureComponent {
  render () {
    const {
      ctaLabel,
      ctaOrder,
      description,
      isOnlyTool,
      Logo,
      onDownloadClick,
      onToggleVideo,
      playable,
      title,
      tool
    } = this.props

    const toolImageClassname = cx(downloadStyles[`${tool}Image`], {
      [downloadStyles.imgTool]: !isOnlyTool,
      [downloadStyles.singleImgTool]: isOnlyTool
    })

    return (
      <Fragment>
        <div className={typeStyles.content}>
          <div className={toolImageClassname} onClick={onToggleVideo}>
            { playable && <PlayIcon /> }
          </div>
          <Spaced vertical='xs'>
            <Logo className={downloadStyles.logoImage} />
          </Spaced>
          <Text order='subtitle' size='larger' color='text-darker' element='h3'>
            {title}
          </Text>
          <Text order='body' color='text-lighter' prose>
            <Color shade='lighter'>
              <Padded horizontal='s'>
                <p
                  className={cx(typeStyles.description, typeStyles.horzDescription, { [downloadStyles.singleToolDescription]: isOnlyTool })}>
                  {description}
                </p>
              </Padded>
            </Color>
          </Text>
        </div>
        <Spaced vertical='s'>
          <div className={cx(typeStyles.buttonWrap, typeStyles.horzButtonWrap)}>
            <Button
              order={ctaOrder}
              size='larger'
              role='button'
              onClick={onDownloadClick}
            >
              {ctaLabel}
            </Button>
          </div>
        </Spaced>
      </Fragment>
    )
  }
}

ToolItem.propTypes = {
  ctaLabel: string,
  ctaOrder: string,
  description: string,
  isOnlyTool: bool,
  Logo: any,
  onDownloadClick: func,
  onToggleVideo: func,
  playable: bool,
  title: string,
  tool: string.isRequired
}

ToolItem.defaultProps = {
  ctaOrder: 'primary-alt'
}
