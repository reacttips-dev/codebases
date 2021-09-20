import React, {
    useCallback,
    useEffect,
    useRef,
    forwardRef,
    useState
} from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import isVisualRegressionTest from '~/lib/is-visual-regression-test'
import {
    CollectionPropTypes
} from '~/lib/prop-types'

import {
    trackGAEvent
} from '~/components/VendorScripts/vendors/google-analytics'
import Modal from '~/components/_atoms/Modal'

import Player from '../Player'

import styles from './popup.scss'

const ToolbarButton = forwardRef(({
    type,
    ...props
}, ref) => ( <
    button type = "button"
    styleName = "toolbar-button"
    className = {
        classNames(styles[`is-${type}`])
    }
    ref = {
        ref
    }
    aria - label = "Close popup" { ...props
    } >
    {
        type === 'close' ? ( <
            svg width = "100%"
            height = "100%"
            viewBox = "0 0 18 16"
            xmlns = "http://www.w3.org/2000/svg" >
            <
            path d = "M1.210526.210526l15.578948 15.578948M16.789474.210526L1.210526 15.789474" / >
            <
            /svg>
        ) : ( <
            svg width = "100%"
            height = "100%"
            viewBox = "0 0 8 17"
            xmlns = "http://www.w3.org/2000/svg" >
            <
            path d = "M.707.707l7.79 7.79m0 0l-7.79 7.79"
            fill = "currentColor"
            fillRule = "evenodd" /
            >
            <
            /svg>
        )
    } <
    /button>
))

function useVimeoPopup({
    open,
    videos,
    selected,
    onChange,
    onClose,
    gaCategory
}) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const watchTimer = useRef(Date.now())
    const currentIndex = selected ? selected.index : selectedIndex
    const video = videos[currentIndex]

    useEffect(() => {
        resetWatchTimer()
    }, [open])

    const resetWatchTimer = () => {
        const now = Date.now()
        const watchTime = now - watchTimer.current
        watchTimer.current = now

        return Math.round(watchTime / 1000)
    }

    const getTrackingLabel = ({
        trackingLabel,
        id
    }) => trackingLabel || id

    const trackWatchTime = useCallback(() => {
        if (gaCategory) {
            trackGAEvent(gaCategory, 'modal_watch', getTrackingLabel(video), {
                value: resetWatchTimer()
            })
        }
    }, [gaCategory, video])

    const handleClose = useCallback(() => {
        trackWatchTime()
        onChange && onChange(null)
        onClose()
    }, [onChange, onClose, trackWatchTime])

    const handleNewIndex = useCallback(
        step => () => {
            let newIndex = currentIndex + step
            while (true) {
                newIndex =
                    newIndex >= videos.length ?
                    0 :
                    newIndex < 0 ?
                    videos.length - 1 :
                    newIndex

                if (newIndex === currentIndex || videos[newIndex].id) {
                    break
                }
                newIndex += step
            }
            setSelectedIndex(newIndex)

            const action = step > 0 ? 'modal_prev' : 'modal_next'

            trackWatchTime()

            if (gaCategory) {
                trackGAEvent(gaCategory, action, getTrackingLabel(videos[newIndex]))
            }

            if (onChange) {
                onChange({
                    index: newIndex,
                    action
                })
            }
        }, [videos, currentIndex, onChange, gaCategory, trackWatchTime]
    )

    return {
        video,
        handleClose,
        handlePrev: handleNewIndex(1),
        handleNext: handleNewIndex(-1)
    }
}

/**
 * Vimeo Player Popup component
 */
const Popup = ({
        open,
        videos,
        onClose,
        onChange,
        titleComponent: Title,
        selected,
        gaCategory
    }) => {
        const {
            handlePrev,
            handleNext,
            video,
            handleClose
        } = useVimeoPopup({
            open,
            videos,
            selected,
            onChange,
            onClose,
            gaCategory
        })
        const closeButton = useRef()
        const focusTrap = useRef()

        /**
         * We want to trap focus in the popup, so that when Shift-Tab is pressed on the Close button
         * (which is first element) we go to the last element of the popup. To do that we introduce
         * additional element called `focusTrap` which we focus from JS and then the browser continues
         * to focus previous element which will be the last element of the popup.
         * As we need the browser to continue going backwards after changing focus we set the
         * `focusPrevious` data attribute on the focusTrap element.
         * We avoid using state here because we don't want to trigger a rerender and keep the focus
         * routine.
         * When the focusTrap element receives focus the normal way, it means we reached the end of
         * the popup, so the focus is moved to the close button.
         */
        const handleShiftTab = e => {
            if (e.shiftKey && e.key === 'Tab') {
                focusTrap.current.dataset.focusPrevious = 'true'
                focusTrap.current.focus()
            }
        }
        const handleFocusTrap = () => {
            if (focusTrap.current.dataset.focusPrevious === 'true') {
                focusTrap.current.dataset.focusPrevious = 'false'
            } else {
                closeButton.current.focus()
            }
        }

        return ( <
            Modal open = {
                open
            }
            focus = {
                true
            }
            onDismiss = {
                handleClose
            }
            styleName = "modal" >
            <
            Modal.Content styleName = "modal-content" >
            <
            div styleName = "toolbar" >
            <
            ToolbarButton type = "close"
            data - id = "video-popup-close"
            onClick = {
                handleClose
            }
            aria - label = "close popup"
            ref = {
                closeButton
            }
            onKeyDown = {
                handleShiftTab
            }
            /> <
            p styleName = "title"
            data - id = "video-popup-title" > {
                Title ? < Title { ...video
                }
                /> : video.title} <
                /p> {
                    videos.length > 1 && ( <
                        div styleName = "toolbar-nav" >
                        <
                        ToolbarButton type = "prev"
                        data - id = "video-popup-prev"
                        onClick = {
                            handlePrev
                        }
                        aria - label = "Previous video" /
                        >
                        <
                        ToolbarButton type = "next"
                        data - id = "video-popup-next"
                        onClick = {
                            handleNext
                        }
                        aria - label = "Next video" /
                        >
                        <
                        /div>
                    )
                } <
                /div> <
                div styleName = "player" > {!isVisualRegressionTest && ( <
                        Player videoId = {
                            video.id
                        }
                        autoplay playsinline / >
                    )
                } <
                /div> <
                div tabIndex = "0"
                ref = {
                    focusTrap
                }
                onFocus = {
                    handleFocusTrap
                }
                /> <
                /Modal.Content> <
                /Modal>
            )
        }

        Popup.propTypes = {
            open: PropTypes.bool.isRequired,
            onClose: PropTypes.func.isRequired,
            videos: CollectionPropTypes({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                title: PropTypes.string,
                trackingLabel: PropTypes.string
            }).isRequired,
            selected: PropTypes.shape({
                index: PropTypes.number.isRequired
            }),
            titleComponent: PropTypes.func,
            onChange: PropTypes.func,
            gaCategory: PropTypes.string
        }

        export default Popup