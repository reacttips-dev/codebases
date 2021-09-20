import React from 'react'
import PropTypes from 'prop-types'

import getVideoLink from '../lib/get-video-link'

/**
 * Vimeo Player component
 * @see https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters
 */
const Player = ({
    videoId,
    width = '100%',
    height = '100%',
    autoplay = false,
    playsinline = false,
    ...props
}) => ( <
    iframe allowFullScreen webkitallowfullscreen = "true"
    mozallowfullscreen = "true"
    width = {
        width
    }
    height = {
        height
    }
    frameBorder = "0"
    autoPlay = {
        autoplay
    }
    allow = "autoplay"
    src = {
        getVideoLink(videoId, autoplay, playsinline)
    } { ...props
    }
    />
)

Player.propTypes = {
    videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    autoplay: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default Player
export {
    getVideoLink
}