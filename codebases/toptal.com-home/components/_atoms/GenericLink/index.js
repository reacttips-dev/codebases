import React, {
    forwardRef
} from 'react'
import PropTypes from 'prop-types'

import {
    LinkableEntityWithGAPropTypes
} from '~/lib/prop-types'
import {
    gaDataset
} from '~/lib/ga-helpers'

/**
 * Sometimes we just need a simple link with GA dataset included
 * that can be a wrapper or just takes a label
 */
const GenericLink = forwardRef(
    ({
            label,
            gaCategory,
            gaEvent,
            gaLabel,
            children,
            a11yHidden = false,
            className,
            ...props
        },
        ref
    ) => ( <
        a { ...gaDataset(gaCategory, gaEvent, gaLabel)
        } { ...props
        } { ...(a11yHidden && {
                'aria-hidden': true,
                tabIndex: '-1'
            })
        } { ...{
                ref,
                className
            }
        } >
        {
            children || label
        } <
        /a>
    )
)

GenericLink.propTypes = {
    ...LinkableEntityWithGAPropTypes,
    label: PropTypes.string,
    children: PropTypes.node,
    a11yHidden: PropTypes.bool,
    className: PropTypes.string
}

GenericLink.displayName = 'GenericLink'

export default GenericLink