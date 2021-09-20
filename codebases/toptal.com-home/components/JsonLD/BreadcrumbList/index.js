import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import {
    CollectionPropTypes
} from '~/lib/prop-types'

const BreadcrumbList = ({
    items
}) => ( <
    Helmet >
    <
    script type = "application/ld+json" > {
        JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map(({
                name,
                url
            }, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: name,
                item: url
            }))
        })
    } <
    /script> <
    /Helmet>
)

BreadcrumbList.propTypes = {
    items: CollectionPropTypes({
        name: PropTypes.string.isRequired,
        url: PropTypes.string
    }).isRequired
}

export default BreadcrumbList