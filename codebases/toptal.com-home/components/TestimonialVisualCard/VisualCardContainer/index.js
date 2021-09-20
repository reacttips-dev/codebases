import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import unorphan from '~/lib/unorphan'

import LazyLoadImage from '~/components/_atoms/LazyLoadImage'
import {
    ToptalEmblem
} from '~/components/Logos'
import {
    QuoteIcon
} from '~/components/_atoms/Icons'

import '../testimonial-visual-card.scss'

export const VisualCardContainer = ({
        previewVideoUrl,
        previewSquareImageUrl,
        previewWideImageUrl,
        authorLogoImageUrl,
        authorCompany,
        title,
        quote,
        author,
        authorTitle,
        className,
        coverClassName,
        type,
        children
    }) => ( <
        div styleName = {
            classNames('card', {
                'no-video-preview': !previewVideoUrl
            })
        }
        className = {
            className
        } >
        <
        div styleName = {
            coverClassName
        } >
        <
        LazyLoadImage src = {
            previewSquareImageUrl || previewWideImageUrl
        }
        effect = {
            LazyLoadImage.Variant.Effect.Opacity
        }
        alt = "" /
        >
        <
        /div> {
            authorLogoImageUrl && ( <
                div styleName = "logo" > {
                    type === 'collaboration_article' && ( <
                        span styleName = "collaboration-logo" >
                        <
                        ToptalEmblem / >
                        <
                        /span>
                    )
                } <
                LazyLoadImage styleName = "logo-image"
                src = {
                    authorLogoImageUrl
                }
                alt = {
                    authorCompany
                }
                /> <
                /div>
            )
        } {
            quote && ( <
                >
                <
                QuoteIcon styleName = "icon-quote" / >
                <
                p styleName = "quote-text" > {
                    quote
                } < /p> <
                />
            )
        } {
            title && < p styleName = "card-title" > {
                    unorphan(title)
                } < /p>} {
                    author && ( <
                        div styleName = "card-author-container" >
                        <
                        p styleName = "card-author" > {
                            author
                        } < /p> <
                        p styleName = "card-author-title" > {
                            authorTitle
                        } < /p> <
                        /div>
                    )
                } {
                    children
                } <
                /div>
        )

        VisualCardContainer.propTypes = {
            previewVideoUrl: PropTypes.string,
            previewSquareImageUrl: PropTypes.string,
            authorLogoImageUrl: PropTypes.string,
            previewWideImageUrl: PropTypes.string,
            authorWhiteLogoImageUrl: PropTypes.string,
            authorCompany: PropTypes.string,
            title: PropTypes.string,
            quote: PropTypes.string,
            author: PropTypes.string,
            authorTitle: PropTypes.string,
            className: PropTypes.string,
            coverClassName: PropTypes.string,
            type: PropTypes.string
        }