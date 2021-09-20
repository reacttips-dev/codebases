import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
    pick
} from 'lodash'

import {
    variantNames
} from '~/lib/get-variants'

import {
    VisualCardContainer
} from '../VisualCardContainer'
import styles from '../testimonial-visual-card.scss'

export const ARTICLE_CTA_TEXT = 'Read more'

const Link = ({
    url,
    title,
    label,
    newWindow
}) => ( <
    a styleName = "cta"
    href = {
        url
    }
    aria - label = {
        title
    }
    target = {
        variantNames({
            _blank: newWindow
        })
    } >
    {
        label || ARTICLE_CTA_TEXT
    } <
    /a>
)

Link.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string,
    label: PropTypes.string,
    newWindow: PropTypes.bool
}

export const ArticleCard = props => {
    const {
        authorWhiteLogoImageUrl,
        className,
        url,
        title,
        link
    } = props

    return ( <
        VisualCardContainer { ...props
        }
        authorLogoImageUrl = {
            authorWhiteLogoImageUrl
        }
        className = {
            classNames(className, styles['is-article'])
        }
        coverClassName = "article-cover" >
        <
        Link { ...{
                url,
                title
            }
        } { ...link
        }
        /> <
        /VisualCardContainer>
    )
}

ArticleCard.propTypes = {
    ...VisualCardContainer.propTypes,
    previewSquareImageUrl: PropTypes.string,
    authorWhiteLogoImageUrl: PropTypes.string,
    authorCompany: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    ...pick(Link, ['url', 'title']),
    link: PropTypes.shape(pick(Link, ['label', 'newWindow']))
}