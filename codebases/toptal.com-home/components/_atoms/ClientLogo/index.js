import {
    isBrowser
} from '@toptal/frontier'
import React, {
    Suspense
} from 'react'
import PropTypes from 'prop-types'

/**
 * Client logo (inlined SVG which can be colored via CSS)
 */
const ClientLogo = ({
        identifier,
        ...props
    }) => {
        if (!isBrowser()) {
            return null
        }

        const Image = React.lazy(() =>
            import (`./images/${identifier}`))

        return ( <
            Suspense fallback = {
                null
            } > {
                Image ? < Image { ...props
                }
                /> : null}</Suspense >
            )
        }

        ClientLogo.propTypes = {
            identifier: PropTypes.string.isRequired
        }

        export default ClientLogo