import {
    noop
} from 'lodash'
import React, {
    useState,
    useRef
} from 'react'
import PropTypes from 'prop-types'

import Popup from '../Popup'

import './button.scss'

/**
 * Vimeo Play Button component
 * @description handles showing/closing Vimeo.Popup
 */
const Button = ({
    children,
    videos,
    className,
    style,
    onOpen = noop,
    handleVideoChange,
    gaCategory,
    title
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const button = useRef()

    const handleButtonClick = event => {
        setIsOpen(true)
        onOpen(event)
    }

    const handleClose = () => {
        setIsOpen(false)
        button.current.focus()
    }

    return ( <
        >
        <
        button type = "button"
        styleName = "play-btn"
        onClick = {
            handleButtonClick
        }
        className = {
            className
        }
        aria - label = {
            title && `${children} - ${title}`
        }
        aria - haspopup = "dialog"
        ref = {
            button
        } { ...{
                style
            }
        } >
        {
            children
        } <
        /button> <
        Popup open = {
            isOpen
        } { ...{
                videos,
                gaCategory
            }
        }
        onClose = {
            handleClose
        }
        onChange = {
            handleVideoChange
        }
        /> <
        />
    )
}

Button.propTypes = {
    videos: Popup.propTypes.videos,
    className: PropTypes.string,
    style: PropTypes.object,
    onOpen: PropTypes.func,
    gaCategory: PropTypes.string,
    title: PropTypes.string
}

export default Button