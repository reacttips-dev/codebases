import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import {
    VariantPropTypes
} from '~/lib/prop-types'

import Card from '~/components/_atoms/Card'
import SkillTag from '~/components/_atoms/SkillTag'
import LazyLoadImage from '~/components/_atoms/LazyLoadImage'
import {
    QuoteIcon
} from '~/components/_atoms/Icons'

import AuthorName from './AuthorName'

import './testimonial-card.scss'

const Variant = {
    CircleAvatar: 'circle-avatar',
    SquareAvatar: 'square-avatar'
}

/**
 * Testimonial Card component
 */
const TestimonialCard = React.forwardRef(
    ({
            text,
            author,
            authorTitle,
            authorAltName = authorTitle,
            authorCompany,
            authorSkills = [],
            authorUrl,
            authorImageUrl,
            className,
            omitQuoteIcon,
            variant,
            authorNameRenderer: AuthorNameRenderer = AuthorName
        },
        ref
    ) => {
        const isSquareAvatar = variant === Variant.SquareAvatar
        const showAuthorImage =
            authorImageUrl && (variant === Variant.CircleAvatar || isSquareAvatar)

        if (authorTitle && !isSquareAvatar) {
            author += `, ${authorTitle}`
        }

        return ( <
            Card as = "blockquote"
            styleName = "container"
            className = {
                className
            }
            ref = {
                ref
            } >
            <
            div > {!omitQuoteIcon && < QuoteIcon styleName = "icon-quote" / >
            } <
            p styleName = "text" > {
                text
            } < /p> <
            /div>

            <
            div styleName = "author-details" > {
                showAuthorImage && ( <
                    LazyLoadImage src = {
                        authorImageUrl
                    }
                    styleName = {
                        classnames({
                            [Variant.CircleAvatar]: variant === TestimonialCard.Variant.CircleAvatar,
                            [Variant.SquareAvatar]: isSquareAvatar
                        })
                    }
                    alt = ""
                    data - happo - hide /
                    >
                )
            } <
            div styleName = "author-info" >
            <
            AuthorNameRenderer { ...{
                    author,
                    authorUrl
                }
            }
            />

            {
                isSquareAvatar ? ( <
                    p styleName = "author-title" > {
                        authorTitle
                    } < /p>
                ) : ( <
                    p styleName = "author-company" > {
                        authorCompany
                    } < /p>
                )
            } <
            /div> {
                authorSkills.length > 0 && ( <
                    div styleName = "skills" >
                    <
                    p styleName = "skills-title" > Expertise in: < /p> {
                        authorSkills.map(skill => ( <
                            SkillTag key = {
                                skill
                            }
                            tag = {
                                {
                                    label: skill
                                }
                            }
                            theme = {
                                SkillTag.Variant.Theme.CaptionBold
                            }
                            />
                        ))
                    } <
                    /div>
                )
            } <
            /div> <
            /Card>
        )
    }
)

TestimonialCard.displayName = 'TestimonialCard'

export const TestimonialPropTypes = {
    text: PropTypes.node.isRequired,
    authorTitle: PropTypes.string,
    authorCompany: PropTypes.string,
    authorImageUrl: PropTypes.string,
    authorSkills: PropTypes.arrayOf(PropTypes.string),
    ...AuthorName.propTypes
}

TestimonialCard.propTypes = {
    ...TestimonialPropTypes,
    variant: VariantPropTypes(Variant),
    authorAltName: PropTypes.string
}

TestimonialCard.Variant = Variant

export default TestimonialCard