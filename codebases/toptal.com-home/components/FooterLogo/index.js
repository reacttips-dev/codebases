import React from 'react'
import PropTypes from 'prop-types'
import {
    pick
} from 'lodash'

import CompoundLogo from '~/components/CompoundLogo'

import classes from './footer-logo.scss'

const styles = pick(classes, ['container', 'headline', 'headline-container'])

const FooterLogo = ({
    href,
    headline,
    title,
    logo
}) => ( <
    CompoundLogo isMonotone layout = {
        {}
    } { ...{
            href,
            headline,
            title,
            styles
        }
    } { ...logo
    }
    />
)

FooterLogo.propTypes = {
    href: PropTypes.string,
    headline: PropTypes.string,
    title: PropTypes.string,
    logo: PropTypes.shape({
        suffix: CompoundLogo.propTypes.suffix
    })
}

export default FooterLogo