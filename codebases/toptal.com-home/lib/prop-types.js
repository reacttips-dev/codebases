import PropTypes from 'prop-types'

import {
    SUPPORTED_VERTICALS
} from '~/lib/constants'
import {
    FetchStatus
} from '~/lib/fetch-status'
import {
    toHtmlGaDataset
} from '~/lib/ga-helpers'

export const LinkableEntityPropTypes = {
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
}

export const GATrackingPropTypes = {
    gaCategory: PropTypes.string,
    gaEvent: PropTypes.string,
    gaLabel: PropTypes.string
}

export const GATrackingPropTypesShape = PropTypes.shape(GATrackingPropTypes)

export const GADatasetPropTypesShape = PropTypes.shape(
    toHtmlGaDataset(PropTypes.string, PropTypes.string, PropTypes.string)
)

export const LinkableEntityPropTypesShape = PropTypes.shape(
    LinkableEntityPropTypes
)

export const LinkableEntityWithGAPropTypes = {
    ...LinkableEntityPropTypes,
    ...GATrackingPropTypes
}

export const LinkableEntityWithGAPropTypesShape = PropTypes.shape(
    LinkableEntityWithGAPropTypes
)

export const LinkableEntityArray = PropTypes.arrayOf(
    LinkableEntityPropTypesShape
)

export const LinkableEntityWithGAArray = PropTypes.arrayOf(
    LinkableEntityWithGAPropTypesShape
)

export const VerticalPropTypes = PropTypes.oneOf(SUPPORTED_VERTICALS)

export const VerticalPropTypesShape = PropTypes.shape({
    title: PropTypes.string.isRequired,
    name: VerticalPropTypes.isRequired,
    publicUrl: PropTypes.string.isRequired
})

export const CollectionPropTypes = (item, isExact) => {
    const {
        arrayOf,
        shape,
        exact
    } = PropTypes

    return arrayOf(isExact ? exact(item) : shape(item))
}

export const VariantPropTypes = (variants, allowMultiple) => {
    const variant = PropTypes.oneOf(Object.values(variants))

    if (!allowMultiple) {
        return variant
    }

    return PropTypes.oneOfType([variant, PropTypes.arrayOf(variant)])
}

export const ExperimentsPropTypes = CollectionPropTypes({
    name: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired
})

export const CtaSectionPropTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    ctas: LinkableEntityWithGAArray.isRequired
}

export const FetchStatusPropTypes = VariantPropTypes(FetchStatus)

export const ShapeWithOmitted = (shape, omitted) => {
    shape = { ...shape
    }
    Array.isArray(omitted) ?
        omitted.forEach(prop => delete shape[prop]) :
        delete shape[omitted]
    return PropTypes.shape(shape)
}