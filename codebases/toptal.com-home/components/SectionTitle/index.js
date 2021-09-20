import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import getVariants from '~/lib/get-variants'
import {
    VariantPropTypes
} from '~/lib/prop-types'

import './section-title.scss'

// eventually only bottom margin should be ever used and these variants should be removed
const Variant = {
    Margin: {
        Standard: 'standard',
        Bottom: 'bottom'
    }
}

const SectionTitle = ({
    children,
    className,
    margin,
    dataId
}) => {
    if (!children) {
        return null
    }

    return ( <
        h2 styleName = "root"
        styleName = {
            classNames(getVariants({
                margin
            }))
        }
        className = {
            className
        }
        data - id = {
            dataId
        }
        dangerouslySetInnerHTML = {
            {
                __html: children
            }
        }
        />
    )
}

SectionTitle.propTypes = {
    children: PropTypes.string,
    margin: VariantPropTypes(Variant.Margin, true),
    dataId: PropTypes.string
}

SectionTitle.Variant = Variant

export default SectionTitle