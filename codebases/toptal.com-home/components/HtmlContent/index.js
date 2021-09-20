import React, {
    forwardRef
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './html-content.scss'

const HtmlContent = forwardRef(
    ({
            content,
            as: Element = 'div',
            className,
            isUnstyled,
            id,
            dataId,
            tabIndex,
            ...props
        },
        ref
    ) => ( <
        Element ref = {
            ref
        }
        className = {
            className
        }
        id = {
            id
        }
        data - id = {
            dataId
        }
        styleName = {
            classNames({
                content: !isUnstyled
            })
        }
        dangerouslySetInnerHTML = {
            {
                __html: content
            }
        } { ...{
                tabIndex
            }
        } { ...props
        }
        />
    )
)

HtmlContent.propTypes = {
    content: PropTypes.string.isRequired,
    className: PropTypes.string,
    as: PropTypes.string,
    isUnstyled: PropTypes.bool,
    id: PropTypes.string,
    dataId: PropTypes.string,
    tabIndex: PropTypes.number
}

HtmlContent.displayName = 'HtmlContent'

export default HtmlContent