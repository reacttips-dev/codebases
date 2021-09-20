import React from 'react'
import PropTypes from 'prop-types'

import {
    LinkableEntityWithGAArray
} from '~/lib/prop-types'

import {
    Link
} from '~/components/CTA'

import './hero-cta.scss'

const HeroCTA = ({
    ctas,
    className
}) => ( <
    div className = {
        className
    }
    styleName = "container" > {
        ctas.map(cta => ( <
            Link key = {
                cta.href
            }
            size = {
                Link.Variant.Size.ExtraLarge
            }
            data - id = "hero-cta" { ...cta
            }
            />
        ))
    } <
    /div>
)

HeroCTA.propTypes = {
    ctas: LinkableEntityWithGAArray.isRequired,
    className: PropTypes.string
}

export default HeroCTA