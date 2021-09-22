import React from 'react'
import { func } from 'prop-types'

import { Animation, IconButton } from '@invisionapp/helios'
import { Close } from '@invisionapp/helios/icons'
import downloadStyles from '../../../css/modals/download-tools.css'

export default class StudioVideo extends React.PureComponent {
  render () {
    const { onToggleVideo } = this.props

    return (
      <Animation
        order='drop-in-bottom'
        speed='fast'
        easing='out'
        count='1'
        fillMode='both'
        passThrough
      >
        <div className={downloadStyles.player}>
          <IconButton
            color='light'
            tooltip='Close'
            withTooltipRelativeWrapper='false'
            tooltipPlacement='top'
            withBackground
            withTooltip
            keepFocus={false}
            isTooltipNonInteractive
            disabled={false}
            onClick={onToggleVideo}
            className={downloadStyles.closeBtn}
          >
            <Close
              fill='white'
              size={24}
            />
          </IconButton>
          <iframe src='//player.vimeo.com/video/238515862?autoplay=1&amp;api=1' frameBorder='0' />
        </div>
      </Animation>
    )
  }
}

StudioVideo.propTypes = {
  onToggleVideo: func
}
