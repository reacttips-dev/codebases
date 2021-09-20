import React from 'react'
import PropTypes from 'prop-types'

import {
    placeholderImage
} from '~/lib/constants'

const ImageSource = ({
    srcSet,
    type,
    media,
    sizes,
    lazyLoad = true
}) => ( <
    source key = {
        srcSet
    }
    data - srcset = {
        lazyLoad ? srcSet : undefined
    }
    srcSet = {
        lazyLoad ? placeholderImage : srcSet
    } { ...{
            type,
            sizes,
            media
        }
    }
    />
)

ImageSource.propTypes = {
    srcSet: PropTypes.string,
    type: PropTypes.string,
    sizes: PropTypes.string,
    media: PropTypes.string,
    lazyLoad: PropTypes.bool
}

ImageSource.displayName = 'ImageSource'

export default ImageSource