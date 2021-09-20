import React from 'react'
import PropTypes from 'prop-types'

import {
    CollectionPropTypes
} from '~/lib/prop-types'

import './skip-links.scss'

/**
 * The skip link to the Navigation is the most universal skip link we currently have,
 * every other skip link should be added at the page level depending
 * on the content for that page
 */
const SkipLinks = ({
    links
}) => ( <
    div id = "skip-links"
    styleName = "skip-links" >
    <
    ul >
    <
    li >
    <
    a href = "#nav" > Skip to navigation < /a> <
    /li> {
        links.map(({
            target,
            label
        }) => ( <
            li key = {
                label
            } >
            <
            a href = {
                `#${target}`
            } > {
                label
            } < /a> <
            /li>
        ))
    } <
    /ul> <
    /div>
)

SkipLinks.propTypes = {
    links: CollectionPropTypes({
        target: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })
}

export default SkipLinks