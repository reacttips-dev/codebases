import React, {
    useMemo,
    useCallback
} from 'react'
import PropTypes from 'prop-types'

import {
    CollectionPropTypes,
    GATrackingPropTypes
} from '~/lib/prop-types'

import Vimeo from '~/components/Vimeo'
import {
    trackGAEvent
} from '~/components/VendorScripts/vendors/google-analytics'

import {
    VisualCardContainer
} from '../VisualCardContainer'
import '../testimonial-visual-card.scss'

export const VideoCard = ({
    gaCategory,
    gaEvent,
    gaLabel,
    videoIdentifier,
    videos = [],
    authorCompany,
    authorWhiteLogoImageUrl: authorLogoImageUrl,
    className,
    previewVideoUrl,
    title,
    videoCtaText = 'Watch the video',
    ...rest
}) => {
    gaCategory = gaCategory || 'video_card'

    const cachedVideos = useMemo(
        () => [{
                id: videoIdentifier,
                title: authorCompany
            },
            ...videos.filter(({
                id
            }) => id !== videoIdentifier)
        ], [videos, authorCompany, videoIdentifier]
    )

    const handleVideoOpen = useCallback(() => {
        trackGAEvent(
            gaCategory,
            gaEvent || 'video_open',
            gaLabel || videoIdentifier
        )
    }, [gaCategory, gaEvent, gaLabel, videoIdentifier])

    return ( <
        VisualCardContainer { ...{
                previewVideoUrl,
                authorCompany,
                authorLogoImageUrl,
                title
            }
        } { ...rest
        }
        coverClassName = "video-cover"
        styleName = "is-video"
        className = {
            className
        } >
        <
        Vimeo.Button className = "video-cta"
        videos = {
            cachedVideos
        }
        onOpen = {
            handleVideoOpen
        }
        title = {
            title
        } { ...{
                gaCategory
            }
        } >
        {
            videoCtaText
        } <
        /Vimeo.Button> {
            previewVideoUrl && ( <
                figure >
                <
                video src = {
                    previewVideoUrl
                }
                autoPlay loop muted / >
                <
                /figure>
            )
        } <
        /VisualCardContainer>
    )
}

VideoCard.propTypes = {
    ...GATrackingPropTypes,
    ...VisualCardContainer.propTypes,
    previewVideoUrl: PropTypes.string,
    authorWhiteLogoImageUrl: PropTypes.string,
    authorCompany: PropTypes.string,
    title: PropTypes.string,
    videoIdentifier: PropTypes.string.isRequired,
    className: PropTypes.string,
    videos: CollectionPropTypes({
        id: PropTypes.string,
        title: PropTypes.string
    })
}