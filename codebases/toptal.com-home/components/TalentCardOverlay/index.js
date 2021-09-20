import React from 'react'
import PropTypes from 'prop-types'

import {
    VIEW_FULL_PROFILE
} from '~/lib/lang'
import './talent-card-overlay.scss'

const TalentCardOverlay = ({
    text = VIEW_FULL_PROFILE,
    className
}) => ( <
    div styleName = "overlay"
    className = {
        className
    } >
    <
    span > {
        text
    } < /span> <
    /div>
)

TalentCardOverlay.propTypes = {
    text: PropTypes.string,
    className: PropTypes.string
}

export default TalentCardOverlay