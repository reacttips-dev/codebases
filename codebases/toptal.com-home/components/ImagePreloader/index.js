import {
    isBrowser
} from '@toptal/frontier'
import React from 'react'
import PropTypes from 'prop-types'
import {
    Helmet
} from 'react-helmet'
import {
    isObject
} from 'lodash'

const ImagePreloader = ({
    images
}) => {
    if (isBrowser()) {
        return null
    }

    return ( <
        Helmet > {
            images.map(image => {
                const props = isObject(image) ? image : {
                    href: image
                }

                const {
                    href
                } = props

                if (href) {
                    return <link rel = "preload"
                    as = "image" { ...props
                    }
                    key = {
                        href
                    }
                    />
                }
            })
        } <
        /Helmet>
    )
}

ImagePreloader.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                href: PropTypes.string,
                media: PropTypes.string
            })
        ])
    ).isRequired
}

export default ImagePreloader