import React, {
    forwardRef
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange.js'

import getVariants from '~/lib/get-variants'
import isVisualRegressionTest from '~/lib/is-visual-regression-test'
import {
    CollectionPropTypes,
    VariantPropTypes
} from '~/lib/prop-types'
import {
    placeholderImage
} from '~/lib/constants'

import ImageSource from './ImageSource'

import './lazy-load-image.scss'

const renderChildren = (children, lazyLoad) => {
    const childrenArray = Array.isArray(children) ? children : [children]
    return childrenArray.map((child, index) => {
        if (child ? .type ? .displayName === 'ImageSource') {
            return React.cloneElement(child, {
                key: child.key || index,
                lazyLoad
            })
        }
        return null
    })
}

const Variant = {
    Effect: {
        Opacity: 'opacity',
        Blur: 'blur'
    }
}

const LazyLoadImage = forwardRef(
    ({
            lazyLoad = true,
            src,
            sources = [],
            alt = '',
            a11yHidden = false,
            className,
            children,
            effect,
            ...props
        },
        ref
    ) => {
        const hasSources = children || !!sources.length
        const lazyLoadEnabled = lazyLoad && !isVisualRegressionTest

        const image = ( <
            img ref = {
                hasSources ? undefined : ref
            }
            data - src = {
                lazyLoadEnabled ? src : undefined
            }
            src = {
                lazyLoadEnabled ? placeholderImage : src
            }
            alt = {
                a11yHidden ? '' : alt
            }
            className = {
                classNames(
                    'lazyload', !isVisualRegressionTest && getVariants({
                        effect
                    }),
                    className
                )
            } { ...props
            }
            />
        )

        if (!hasSources) {
            return image
        }

        return ( <
            picture { ...{
                    ref
                }
            } { ...(a11yHidden && {
                    role: 'presentation'
                })
            } > {
                sources &&
                sources.map(({
                    type,
                    srcSet,
                    sizes,
                    media,
                    lazyLoad
                }) => ( <
                    ImageSource key = {
                        srcSet
                    } { ...{
                            srcSet,
                            type,
                            sizes,
                            media,
                            lazyLoad
                        }
                    }
                    />
                ))
            } {
                children && renderChildren(children, lazyLoad)
            } {
                image
            } <
            /picture>
        )
    }
)

LazyLoadImage.propTypes = {
    children: PropTypes.node,
    lazyLoad: PropTypes.bool,
    effect: VariantPropTypes(Variant.Effect),
    sources: CollectionPropTypes(ImageSource.propTypes),
    src: PropTypes.string,
    alt: PropTypes.string,
    a11yHidden: PropTypes.bool,
    className: PropTypes.string
}

LazyLoadImage.Variant = Variant
LazyLoadImage.Source = ImageSource

LazyLoadImage.displayName = 'LazyLoadImage'

export default LazyLoadImage