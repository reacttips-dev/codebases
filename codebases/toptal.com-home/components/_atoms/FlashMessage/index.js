import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    VariantPropTypes
} from '~/lib/prop-types'
import getVariants from '~/lib/get-variants'

import {
    CloseIcon
} from '~/components/_atoms/Icons'

import './flash-message.scss'

const Variant = {
    Level: {
        Success: 'success',
        Warning: 'warning',
        Error: 'error'
    }
}

const FlashMessage = ({
        level = Variant.Level.Success,
        text,
        onClose,
        isDismissible = true,
        className
    }) => ( <
        div styleName = {
            classNames('container', getVariants({
                level
            }))
        }
        className = {
            className
        } >
        <
        div styleName = "content" > {
            text
        } < /div> {
            isDismissible && < CloseIcon styleName = "close-icon"
            onClick = {
                onClose
            }
            />} <
            /div>
        )

        FlashMessage.propTypes = {
            className: PropTypes.string,
            level: VariantPropTypes(Variant.Level),
            text: PropTypes.string.isRequired,
            isDismissible: PropTypes.bool,
            onClose: PropTypes.func
        }

        FlashMessage.Variant = Variant

        export default FlashMessage