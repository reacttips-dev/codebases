import React from 'react'
import classNames from 'classnames'
import {
    kebabCase
} from 'lodash'

import {
    SUPPORTED_VERTICALS
} from '~/lib/constants'

import {
    TalentPropTypes
} from '../lib/prop-types'

import './talent.scss'

function coordinatesToStyles(latitude, longitude) {
    return {
        left: ((longitude + 180) / 360) * 100 + '%',
        top: (((latitude - 90) * -1) / 180) * 100 + '%'
    }
}

const Talent = ({
    fullName,
    vertical,
    jobTitle,
    latitude,
    longitude,
    previousCompanyName,
    heroImageUrl,
    publicResumeUrl,
    country
}) => ( <
    div styleName = "container" >
    <
    div styleName = "talent" >
    <
    img src = {
        heroImageUrl
    }
    alt = ""
    role = "presentation" / >
    <
    a href = {
        publicResumeUrl
    }
    target = "_blank"
    styleName = "map-card"
    rel = "noopener noreferrer" >
    <
    div styleName = "map" >
    <
    div role = "figure"
    aria - label = {
        `Country of origin - ${country}`
    }
    styleName = "pin"
    style = {
        coordinatesToStyles(latitude, longitude)
    }
    /> <
    /div> <
    p styleName = "name"
    data - id = "hero-talent-name" > {
        fullName
    } <
    /p> <
    p styleName = {
        classNames('vertical', {
            [`is-${kebabCase(vertical.name)}`]: SUPPORTED_VERTICALS.includes(
                vertical.name
            )
        })
    } >
    {
        jobTitle
    } <
    /p> {
        previousCompanyName && ( <
            p styleName = "previously-at" >
            Previously at < strong > {
                previousCompanyName
            } < /strong> <
            /p>
        )
    } <
    /a> <
    /div> <
    /div>
)

Talent.propTypes = TalentPropTypes

export default Talent