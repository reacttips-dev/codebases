import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import getVariants from '~/lib/get-variants'
import {
    GATrackingPropTypes,
    VariantPropTypes
} from '~/lib/prop-types'
import {
    gaDataset
} from '~/lib/ga-helpers'

import GenericLink from '~/components/_atoms/GenericLink'
import LazyLoadImage from '~/components/_atoms/LazyLoadImage'

import './blog-card.scss'

const Variant = {
    Size: {
        Large: 'large'
    }
}

const BlogCard = ({
        title,
        excerpt,
        readingTime,
        publicUrl,
        domain,
        topic,
        postAuthor,
        size,
        biggerRegularCoverImageUrl,
        biggerRetinaCoverImageUrl,
        bigRegularCoverImageUrl,
        bigRetinaCoverImageUrl,
        gaCategory,
        gaEvent,
        gaLabel,
        ...restProps
    }) => {
        const isLargeSize = size === Variant.Size.Large
        const gaData = gaCategory ? gaDataset(gaCategory, gaEvent, gaLabel) : {}
        return ( <
            div styleName = {
                classNames('blog-card', getVariants({
                    size
                }))
            }
            data - id = "blog-card" { ...restProps
            } >
            <
            a styleName = "cover"
            href = {
                publicUrl
            }
            data - happo - hide { ...gaData
            }
            aria - hidden = "true"
            tabIndex = "-1" >
            <
            LazyLoadImage role = "presentation"
            src = {
                bigRetinaCoverImageUrl
            }
            alt = ""
            height = "100"
            data - id = "cover-image" >
            <
            LazyLoadImage.Source srcSet = {
                `${bigRegularCoverImageUrl} 1x, ${bigRetinaCoverImageUrl} 2x`
            }
            media = "(max-width: 600px)" /
            >
            <
            LazyLoadImage.Source srcSet = {
                `${biggerRegularCoverImageUrl} 1x, ${biggerRetinaCoverImageUrl} 2x`
            }
            media = "(min-width: 601px) and (max-width: 767px)" /
            > {
                /*
                            Please do not refactor/group following conditions using fragments
                            since it will break <picture><source> markup, this is intentional.
                            More info here: https://github.com/toptal/frontier-pub/pull/993
                          */
            } {
                isLargeSize && ( <
                    LazyLoadImage.Source srcSet = {
                        `${biggerRegularCoverImageUrl} 1x, ${biggerRetinaCoverImageUrl} 2x`
                    }
                    media = "(min-width: 768px) and (max-width: 1023px)" /
                    >
                )
            } {
                isLargeSize && ( <
                    LazyLoadImage.Source srcSet = {
                        `${bigRegularCoverImageUrl} 1x, ${bigRetinaCoverImageUrl} 2x`
                    }
                    media = "(min-width: 1024px)" /
                    >
                )
            } {
                !isLargeSize && ( <
                    LazyLoadImage.Source srcSet = {
                        `${bigRegularCoverImageUrl} 1x, ${bigRetinaCoverImageUrl} 2x`
                    }
                    />
                )
            } <
            /LazyLoadImage> <
            /a> <
            div styleName = "content" >
            <
            div styleName = "avatar-container" >
            <
            LazyLoadImage src = {
                postAuthor.imageUrl
            }
            styleName = "avatar"
            alt = ""
            width = "48"
            height = "48"
            effect = {
                LazyLoadImage.Variant.Effect.Opacity
            }
            /> <
            /div> <
            div styleName = "breadcrumbs" >
            <
            GenericLink styleName = "breadcrumb-item"
            href = {
                domain.publicUrl
            } { ...gaData
            } >
            {
                domain.title
            } <
            /GenericLink> <
            GenericLink styleName = "breadcrumb-item"
            href = {
                topic.publicUrl
            } { ...gaData
            } >
            {
                topic.name
            } <
            /GenericLink> <
            /div> <
            h3 styleName = "title" >
            <
            a styleName = "link"
            href = {
                publicUrl
            } { ...gaData
            } > {
                title
            } <
            /a> <
            /h3> <
            div styleName = "author" >
            by < strong > {
                postAuthor.fullName
            } < /strong> <
            /div> {
                isLargeSize && ( <
                        >
                        <
                        p styleName = "excerpt" > {
                            excerpt
                        } < /p> <
                        div styleName = "reading-time" > {
                            readingTime > 0 && < span > {
                                readingTime
                            }
                            minute read < /span>} <
                            GenericLink
                            styleName = "reading-continue"
                            href = {
                                publicUrl
                            } { ...gaData
                            } >
                            Continue Reading <
                            /GenericLink> <
                            /div> <
                            />
                        )
                    } <
                    /div> <
                    /div>
            )
        }

        export const BlogCardPropTypes = {
            title: PropTypes.string.isRequired,
            excerpt: PropTypes.string.isRequired,
            readingTime: PropTypes.number.isRequired,
            publicUrl: PropTypes.string.isRequired,
            biggerRegularCoverImageUrl: PropTypes.string.isRequired,
            biggerRetinaCoverImageUrl: PropTypes.string.isRequired,
            bigRegularCoverImageUrl: PropTypes.string.isRequired,
            bigRetinaCoverImageUrl: PropTypes.string.isRequired,
            domain: PropTypes.shape({
                title: PropTypes.string.isRequired,
                publicUrl: PropTypes.string.isRequired
            }),
            topic: PropTypes.shape({
                name: PropTypes.string.isRequired,
                publicUrl: PropTypes.string.isRequired
            }),
            postAuthor: PropTypes.shape({
                fullName: PropTypes.string.isRequired,
                imageUrl: PropTypes.string.isRequired
            }),
            size: VariantPropTypes(Variant.Size),
            ...GATrackingPropTypes
        }

        BlogCard.propTypes = BlogCardPropTypes

        BlogCard.Variant = Variant

        export default BlogCard