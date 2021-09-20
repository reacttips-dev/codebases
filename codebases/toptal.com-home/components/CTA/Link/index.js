import React from 'react'
import PropTypes from 'prop-types'

import {
    gaDataset
} from '~/lib/ga-helpers'
import {
    LinkableEntityWithGAPropTypes
} from '~/lib/prop-types'

import LibraryButton from '~/components/Library/Button'

const {
    Variant,
    HtmlElement
} = LibraryButton

const Link = ({
    href,
    label,
    gaCategory,
    gaEvent,
    gaLabel,
    children,
    ...props
}) => ( <
    LibraryButton as = {
        HtmlElement.Link
    } { ...{
            href
        }
    } { ...gaDataset(gaCategory, gaEvent, gaLabel)
    } { ...props
    } >
    {
        children || label
    } <
    /LibraryButton>
)

Link.propTypes = {
    ...LibraryButton.propTypes,
    ...LinkableEntityWithGAPropTypes,
    label: PropTypes.string
}

Link.Variant = Variant

export default Link