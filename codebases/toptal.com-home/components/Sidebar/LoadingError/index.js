import React from 'react'
import PropTypes from 'prop-types'

import FlashMessage from '~/components/_atoms/FlashMessage'

const LoadingError = ({
    text = 'Error fetching data. Please try again later.'
}) => ( <
    FlashMessage { ...{
            text
        }
    }
    level = {
        FlashMessage.Variant.Level.Error
    }
    isDismissible = {
        false
    }
    />
)

LoadingError.propTypes = {
    text: PropTypes.string
}

export default LoadingError