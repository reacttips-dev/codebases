import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import JsonLD from '~/components/JsonLD'

const StructuredDataSection = ({
    schema
}) => ( <
    JsonLD >
    <
    Helmet >
    <
    script type = "application/ld+json" > {
        JSON.stringify(schema)
    } < /script> <
    /Helmet> <
    /JsonLD>
)

StructuredDataSection.propTypes = {
    schema: PropTypes.object.isRequired
}

export default StructuredDataSection