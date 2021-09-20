import React, {
    useCallback,
    useState
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    CollectionPropTypes
} from '~/lib/prop-types'

import LazyLoadImage from '~/components/_atoms/LazyLoadImage'
import Vimeo from '~/components/Vimeo'
import Quote from '~/components/_atoms/Quote'
import {
    trackGAEvent
} from '~/components/VendorScripts/vendors/google-analytics'

import './video-quote.scss'

/**
 * Video-quote section component
 */

const GA_CATEGORY = 'video_quote'

const VideoQuote = ({
    testimonials
}) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const isMultiQuote = testimonials.length !== 1

    const onLeftArrowClick = () =>
        setActiveIndex(
            activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1
        )
    const onRightArrowClick = () =>
        setActiveIndex(
            activeIndex === testimonials.length - 1 ? 0 : activeIndex + 1
        )

    const {
        previewWideImageUrl,
        title,
        videoIdentifier
    } = testimonials[
        activeIndex
    ]
    const handleVideoOpen = useCallback(videoId => {
        trackGAEvent(GA_CATEGORY, 'video_open', videoId)
    }, [])

    return ( <
        div styleName = "outer-container" > {
            previewWideImageUrl && ( <
                LazyLoadImage src = {
                    previewWideImageUrl
                }
                styleName = "background"
                alt = {
                    title
                }
                width = "100%"
                height = "100%" /
                >
            )
        } <
        div styleName = {
            classNames('container', {
                'is-single-quote': !isMultiQuote
            })
        } >
        <
        span styleName = "arrow arrow-left"
        onClick = {
            onLeftArrowClick
        }
        />

        {
            testimonials.map(
                ({
                    text,
                    authorImageUrl,
                    author,
                    authorCompany,
                    title
                }, index) => ( <
                    Quote styleName = {
                        classNames('quote', {
                            'is-shown': index === activeIndex
                        })
                    }
                    key = {
                        index
                    } >
                    <
                    p styleName = "quote-text"
                    data - id = "quote-text" > {
                        text
                    } <
                    /p> {
                        authorImageUrl && ( <
                            img src = {
                                authorImageUrl
                            }
                            styleName = "author-logo"
                            alt = {
                                authorCompany || author
                            }
                            />
                        )
                    } <
                    /Quote>
                )
            )
        }

        {
            videoIdentifier && ( <
                Vimeo.Button videos = {
                    [{
                        title,
                        id: videoIdentifier
                    }]
                }
                styleName = "play-video-btn"
                gaCategory = {
                    GA_CATEGORY
                }
                onOpen = {
                    () => {
                        handleVideoOpen(videoIdentifier)
                    }
                }
                title = {
                    title
                } >
                Watch the video <
                /Vimeo.Button>
            )
        }

        <
        span styleName = "arrow arrow-right"
        onClick = {
            onRightArrowClick
        }
        /> <
        /div> <
        /div>
    )
}

VideoQuote.propTypes = {
    testimonials: CollectionPropTypes({
        title: PropTypes.string,
        text: PropTypes.string.isRequired,
        authorImageUrl: PropTypes.string,
        author: PropTypes.string,
        previewWideImageUrl: PropTypes.string,
        videoIdentifier: PropTypes.string
    }).isRequired
}

export default VideoQuote