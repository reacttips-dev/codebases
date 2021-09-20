import React from 'react'
import PropTypes from 'prop-types'

import {
    CollectionPropTypes,
    LinkableEntityArray,
    GATrackingPropTypes
} from '~/lib/prop-types'

import BlogCard, {
    BlogCardPropTypes
} from '~/components/BlogCard'
import Link from '~/components/CTA/Link'
import SectionTitle from '~/components/SectionTitle'
import {
    PageSection
} from '~/components/Library'
import Grid, {
    Cell
} from '~/components/Grid'

import './blog-section.scss'

const BlogSection = ({
    title,
    blogPosts,
    ctas,
    className,
    gaCategory,
    gaEvent,
    gaLabel
}) => {
    blogPosts = blogPosts.slice(0, 5)
    return ( <
        PageSection semantic className = {
            className
        }
        width = {
            PageSection.Variant.Width.Fixed
        } >
        <
        SectionTitle styleName = "title"
        dataId = "blog-section-title" > {
            title
        } <
        /SectionTitle> {
            blogPosts.length === 5 && ( <
                div styleName = "items"
                role = "list" > {
                    blogPosts.map((post, index) => ( <
                        BlogCard { ...post
                        }
                        size = {
                            index === 0 ? BlogCard.Variant.Size.Large : null
                        }
                        key = {
                            post.publicUrl
                        }
                        styleName = "blog-card" { ...{
                                gaCategory,
                                gaEvent,
                                gaLabel
                            }
                        }
                        role = "listitem" /
                        >
                    ))
                } <
                /div>
            )
        } {
            blogPosts.length < 5 && ( <
                Grid styleName = "grid-items"
                role = "list" > {
                    blogPosts.map((post, index) => ( <
                        Cell key = {
                            index
                        }
                        tablet = {
                            blogPosts.length === 3 ? 4 : blogPosts.length === 1 ? 12 : 6
                        } >
                        <
                        BlogCard { ...post
                        }
                        size = {
                            blogPosts.length === 1 ? BlogCard.Variant.Size.Large : null
                        }
                        styleName = "blog-card" { ...{
                                gaCategory,
                                gaEvent,
                                gaLabel
                            }
                        }
                        role = "listitem" /
                        >
                        <
                        /Cell>
                    ))
                } <
                /Grid>
            )
        }

        {
            ctas && ( <
                div styleName = "cta-holder" > {
                    ctas.map(({
                        label,
                        href
                    }) => ( <
                        Link theme = {
                            Link.Variant.Theme.SecondaryGrey
                        } { ...{
                                href,
                                label
                            }
                        }
                        key = {
                            href
                        }
                        />
                    ))
                } <
                /div>
            )
        } <
        /PageSection>
    )
}

export const BlogSectionDataPropTypes = {
    title: PropTypes.string.isRequired,
    blogPosts: CollectionPropTypes(BlogCardPropTypes),
    ctas: LinkableEntityArray
}

BlogSection.propTypes = {
    ...BlogSectionDataPropTypes,
    ...GATrackingPropTypes,
    className: PropTypes.string
}

export default BlogSection