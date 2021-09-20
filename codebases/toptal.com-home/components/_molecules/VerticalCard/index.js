import React from 'react'
import PropTypes from 'prop-types'

import {
    Vertical
} from '~/lib/constants'
import {
    VariantPropTypes
} from '~/lib/prop-types'

import VerticalIcon from '~/components/VerticalIcon'
import ArrowLink from '~/components/_atoms/ArrowLink'

import {
    IconType
} from './lib/constants'

import './vertical-card.scss'

const iconTypes = {
    [IconType.DESIGNERS]: Vertical.Designers,
    [IconType.DEVELOPERS]: Vertical.Developers,
    [IconType.PROJECT_MANAGERS]: Vertical.ProjectManagers,
    [IconType.PRODUCT_MANAGERS]: Vertical.ProductManagers,
    [IconType.FINANCE_EXPERTS]: Vertical.FinanceExperts,
    [IconType.PROJECTS]: Vertical.Projects
}

const VerticalCard = ({
    title,
    description,
    linkLabel,
    href,
    iconType,
    className,
    ...props
}) => ( <
    div { ...{
            className
        }
    }
    styleName = "vertical-card"
    tabIndex = {
        0
    }
    onClick = {
        () => {
            window.location.href = href
        }
    } { ...props
    } >
    <
    VerticalIcon styleName = "icon-default"
    variant = {
        iconTypes[iconType]
    }
    /> <
    VerticalIcon styleName = "icon-hover"
    variant = {
        iconTypes[iconType]
    }
    isInverted /
    >
    <
    h3 styleName = "title"
    data - id = "list-item-title" > {
        title
    } <
    /h3> <
    p styleName = "description"
    data - id = "list-item-description" > {
        description
    } <
    /p> <
    ArrowLink styleName = "link-label"
    theme = {
        ArrowLink.Variant.Theme.Dark
    }
    tabIndex = {
        0
    }
    aria - label = {
        linkLabel
    } { ...{
            label: linkLabel,
            href
        }
    }
    /> <
    /div>
)

VerticalCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    linkLabel: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    iconType: VariantPropTypes(IconType).isRequired
}

VerticalCard.displayName = 'VerticalCard'

export default VerticalCard