import React, {
    forwardRef
} from 'react'
import PropTypes from 'prop-types'

import './section-container.scss'

const SectionContainer = forwardRef(
    ({
            children,
            className,
            innerClass,
            id,
            tag: SectionTag = 'section'
        },
        ref
    ) => ( <
        SectionTag styleName = "outer"
        ref = {
            ref
        }
        className = {
            className
        }
        id = {
            id
        } >
        <
        div styleName = "inner"
        className = {
            innerClass
        } > {
            children
        } <
        /div> <
        /SectionTag>
    )
)

SectionContainer.propTypes = {
    tag: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
}

SectionContainer.displayName = 'SectionContainer'

export default SectionContainer