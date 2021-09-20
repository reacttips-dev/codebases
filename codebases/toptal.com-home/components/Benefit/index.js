import React from 'react'
import PropTypes from 'prop-types'

import LazyLoadImage from '~/components/_atoms/LazyLoadImage'

import classes from './benefit.scss'

const Benefit = ({
    title,
    description,
    imageUrl,
    styles = classes
}) => ( <
    >
    <
    LazyLoadImage className = {
        styles.image
    }
    src = {
        imageUrl
    }
    alt = "" / >
    <
    div >
    <
    h3 className = {
        styles.title
    }
    data - id = "benefit-title" > {
        title
    } <
    /h3> <
    p className = {
        styles.description
    } > {
        description
    } < /p> <
    /div> <
    />
)

Benefit.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    styles: PropTypes.shape({
        image: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string
    })
}

export default Benefit