import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    LinkableEntityWithGAPropTypesShape,
    VariantPropTypes
} from '~/lib/prop-types'
import unorphan from '~/lib/unorphan'
import getVariants from '~/lib/get-variants'

import Link from '~/components/CTA/Link'

import './hire-cta.scss'

const Variant = {
    Theme: {
        Blue: 'blue'
    },
    Orientation: {
        Vertical: 'vertical'
    },
    Padding: {
        None: 'none'
    }
}

const HireCta = ({
    title,
    cta: {
        href,
        label,
        ...gaDataset
    },
    className,
    orientation,
    theme,
    buttonVariant = Link.Variant.Theme.PrimaryGreen,
    padding,
    onClick,
    inlineStyles,
    dataId
}) => ( <
    div styleName = {
        classNames(
            'container',
            getVariants({
                orientation,
                theme,
                padding
            })
        )
    }
    className = {
        className
    } >
    <
    p styleName = "title"
    data - id = "hire-cta-title" > {
        unorphan(title)
    } <
    /p> <
    Link styleName = "btn" { ...{
            href,
            label
        }
    }
    theme = {
        buttonVariant
    }
    size = {
        Link.Variant.Size.ExtraLarge
    }
    style = {
        inlineStyles
    }
    data - id = {
        dataId
    } { ...{
            onClick
        }
    } { ...gaDataset
    }
    /> <
    /div>
)

HireCta.propTypes = {
    title: PropTypes.string.isRequired,
    cta: LinkableEntityWithGAPropTypesShape.isRequired,
    className: PropTypes.string,
    theme: VariantPropTypes(Variant.Theme),
    orientation: VariantPropTypes(Variant.Orientation),
    buttonVariant: VariantPropTypes(Link.Variant.Theme),
    padding: VariantPropTypes(Variant.Padding),
    onClick: PropTypes.func,
    inlineStyles: PropTypes.object,
    dataId: PropTypes.string
}

HireCta.Variant = Variant

export default HireCta