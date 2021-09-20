import React from 'react'
import PropTypes from 'prop-types'

import {
    Vertical
} from '~/lib/constants'
import {
    VerticalPropTypes
} from '~/lib/prop-types'

import LazyLoadImage from '~/components/_atoms/LazyLoadImage'
import './vertical-icon.scss'

export const VerticalIconUrl = {
    [Vertical.Developers]: require('~/assets/icons/verticals/developers.svg'),
    [Vertical.Designers]: require('~/assets/icons/verticals/designers.svg'),
    [Vertical.FinanceExperts]: require('~/assets/icons/verticals/finance-experts.svg'),
    [Vertical.ProjectManagers]: require('~/assets/icons/verticals/project-managers.svg'),
    [Vertical.ProductManagers]: require('~/assets/icons/verticals/product-managers.svg'),
    [Vertical.Projects]: require('~/assets/icons/verticals/projects.svg'),
    [`${Vertical.Developers}_inverted`]: require('~/assets/icons/verticals/developers-inverted.svg'),
    [`${Vertical.Designers}_inverted`]: require('~/assets/icons/verticals/designers-inverted.svg'),
    [`${Vertical.FinanceExperts}_inverted`]: require('~/assets/icons/verticals/finance-experts-inverted.svg'),
    [`${Vertical.ProjectManagers}_inverted`]: require('~/assets/icons/verticals/project-managers-inverted.svg'),
    [`${Vertical.ProductManagers}_inverted`]: require('~/assets/icons/verticals/product-managers-inverted.svg'),
    [`${Vertical.Projects}_inverted`]: require('~/assets/icons/verticals/projects-inverted.svg')
}

const VerticalIcon = ({
    variant,
    className,
    isInverted
}) => {
    const iconUrl =
        VerticalIconUrl[isInverted ? `${variant}_inverted` : variant] || ''

    return ( <
        LazyLoadImage src = {
            iconUrl
        }
        styleName = "icon"
        className = {
            className
        }
        alt = "" /
        >
    )
}

VerticalIcon.propTypes = {
    variant: VerticalPropTypes.isRequired,
    className: PropTypes.string,
    isInverted: PropTypes.bool
}

VerticalIcon.defaultProps = {
    isInverted: false
}

export default VerticalIcon