import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    VariantPropTypes
} from '~/lib/prop-types'
import getVariants from '~/lib/get-variants'

import './page-section.scss'

const Variant = {
    Space: {
        Large: 'large',
        Medium: 'medium',
        None: 'none'
    },

    Width: {
        Fixed: 'fixed'
    }
}

const PageSection = React.forwardRef(
    ({
            children,
            className,
            id,
            width,
            space = PageSection.Variant.Space.Large,
            forceSpace,
            semantic,
            as: Element = semantic ? 'section' : 'div',
            style,
            role,
            ...props
        },
        ref
    ) => ( <
        Element styleName = {
            classNames(
                'section', {
                    'force-space': forceSpace
                },
                getVariants({
                    space,
                    width
                })
            )
        }
        id = {
            id
        }
        className = {
            className
        }
        style = {
            style
        }
        ref = {
            ref
        } { ...props
        } >
        {
            children
        } <
        /Element>
    )
)

PageSection.displayName = 'PageSection'

PageSection.Variant = Variant

PageSection.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    id: PropTypes.string,
    space: VariantPropTypes(Variant.Space),
    width: VariantPropTypes(Variant.Width),
    forceSpace: PropTypes.bool,
    semantic: PropTypes.bool,
    as: PropTypes.oneOf(['div', 'section', 'footer']),
    style: PropTypes.object,
    role: PropTypes.string
}

export default PageSection