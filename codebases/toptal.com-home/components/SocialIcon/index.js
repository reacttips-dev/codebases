import React from 'react'
import PropTypes from 'prop-types'

import LinkedInIcon from './linkedin'
import TwitterIcon from './twitter'
import FacebookIcon from './facebook'
import InstagramIcon from './instagram'

const icons = {
    linkedin: LinkedInIcon,
    twitter: TwitterIcon,
    facebook: FacebookIcon,
    instagram: InstagramIcon
}

const SocialIcon = ({
    type,
    size = '100%'
}) => {
    const Icon = icons[type.toLowerCase()]
    return Icon ? < Icon size = {
        size
    }
    /> : null
}

SocialIcon.propTypes = {
    type: PropTypes.string.isRequired
}

export default SocialIcon