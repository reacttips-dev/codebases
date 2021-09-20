import React from 'react'
import PropTypes from 'prop-types'

import TextLink from '~/components/_atoms/TextLink'

import './author-name.scss'

const AuthorName = ({
    authorUrl,
    author
}) => {
    if (authorUrl) {
        return <TextLink href = {
            authorUrl
        }
        label = {
            author
        }
        styleName = "author-link" / >
    }

    return <p styleName = "author-name" > {
        author
    } < /p>
}

AuthorName.propTypes = {
    author: PropTypes.string.isRequired,
    authorUrl: PropTypes.string
}

export default AuthorName