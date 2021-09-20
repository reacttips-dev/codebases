import React, {
    useMemo
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    VariantPropTypes
} from '~/lib/prop-types'
import getVariants, {
    getBooleanVariants
} from '~/lib/get-variants'

import HtmlContent from '~/components/HtmlContent'
import LogoIcon from '~/components/_atoms/LogoIcon'

import {
    getCssMarkerClasses
} from './lib'

import './compound-logo.scss'

const Variant = {
    Type: LogoIcon.Variant,
    Size: {
        Large: 'large',
        Medium: 'medium',
        Small: 'small'
    },
    Layout: {
        Regular: {
            // full, no headline -> full
            default: {
                headline: false
            },
            forTablet: {}
        },
        Gradual: {
            // suffix, no headline -> suffix -> full
            default: {
                wordmark: false,
                headline: false
            },
            forTablet: {
                wordmark: false
            },
            forDesktop: {}
        },
        Foldable: {
            // emblem -> full logo
            default: {
                wordmark: false,
                suffix: false
            },
            forTablet: {}
        },
        Compact: {
            // emblem -> suffix -> full
            default: {
                wordmark: false,
                suffix: false
            },
            forTablet: {
                wordmark: false
            },
            forDesktop: {}
        }
    }
}

const Headline = ({
    headline,
    headlineAs: HeadlineElement = 'div',
    styles,
    className
}) => {
    const endsWithRegistered = headline.endsWith('®')
    if (endsWithRegistered) {
        headline = headline.slice(0, -1).trimEnd()
        headline += '&nbsp;<span>&reg;</span>'
    }

    // We add a wrapping div here to be able to revert the switch flags
    // This is because the wrapped div should be displayed as flex
    // and all the root elements in the parent container are displayed as blocks
    // and we revert all of them by changing display from 'none' to 'block'
    return ( <
        div className = {
            classNames(className, styles['headline-container'])
        } >
        <
        div styleName = "headline" >
        <
        span styleName = "headline-separator" / >
        <
        div > {
            endsWithRegistered ? ( <
                HtmlContent isUnstyled as = {
                    HeadlineElement
                }
                content = {
                    headline
                }
                styleName = "headline-text"
                className = {
                    styles.headline
                }
                />
            ) : ( <
                HeadlineElement styleName = "headline-text"
                className = {
                    styles.headline
                } >
                {
                    headline
                } <
                /HeadlineElement>
            )
        } <
        /div> <
        /div> <
        /div>
    )
}

const CompoundLogo = ({
    layout = Variant.Layout.Regular,
    type,
    size,
    href,
    title,
    suffix,
    headline,
    headlineAs,
    styles = {},
    isMonotone
}) => {
    const markers = useMemo(() => getCssMarkerClasses(layout, suffix), [
        layout,
        suffix
    ])

    const logoProps = {
        isMonotone,
        className: styles.logo
    }

    const wordmarkSwitches = Object.values(layout).map(({
        wordmark
    }) => wordmark)
    const renderWordmark =
        wordmarkSwitches.every(Boolean) ||
        wordmarkSwitches.length > 1 ||
        layout.default.wordmark

    const LogoElement = type ?
        () => < LogoIcon { ...{
                type
            }
        } { ...logoProps
        }
    styleName = "logo" / >
        : () => ( <
            >
            <
            LogoIcon { ...logoProps
            }
            type = {
                Variant.Type.Emblem
            }
            styleName = "emblem" /
            > {
                renderWordmark && ( <
                    LogoIcon { ...logoProps
                    }
                    type = {
                        Variant.Type.Wordmark
                    }
                    styleName = {
                        classNames('wordmark', getVariants(markers.wordmark))
                    }
                    />
                )
            } <
            div styleName = "registered" >
            <
            span > & reg; < /span> <
            /div> <
            />
        )

    const LogoWrapperElement = href ? 'a' : 'div'

    return ( <
        div styleName = {
            classNames('container', {
                ...getBooleanVariants({
                    isMonotone
                }),
                ...getVariants(markers.container)
            })
        }
        className = {
            styles.container
        } >
        <
        LogoWrapperElement styleName = {
            classNames('composite-logo', getVariants(size, 'size'))
        } { ...{
                href,
                title
            }
        }
        aria - label = {
            title
        } >
        <
        LogoElement / >

        {
            suffix && ( <
                div styleName = {
                    classNames('suffix', getVariants(markers.suffix))
                }
                className = {
                    styles.suffix
                } >
                {
                    suffix
                } <
                /div>
            )
        } <
        /LogoWrapperElement>

        {
            headline && ( <
                Headline styleName = {
                    classNames(getVariants(markers.headline))
                } { ...{
                        headline,
                        headlineAs,
                        styles
                    }
                }
                />
            )
        } <
        /div>
    )
}

const LayoutPropTypesShape = PropTypes.shape({
    wordmark: PropTypes.bool,
    suffix: PropTypes.bool,
    headline: PropTypes.bool
})

CompoundLogo.propTypes = {
    layout: PropTypes.shape({
        default: LayoutPropTypesShape,
        forTablet: LayoutPropTypesShape,
        forDesktop: LayoutPropTypesShape,
        forDesktopLarge: LayoutPropTypesShape
    }),
    type: VariantPropTypes(Variant.Type, false),
    size: VariantPropTypes(Variant.Size, false),
    href: PropTypes.string,
    title: PropTypes.string,
    suffix: PropTypes.string,
    headline: PropTypes.string,
    headlineAs: PropTypes.string,
    isMonotone: PropTypes.bool,
    styles: PropTypes.shape({
        container: PropTypes.string,
        logo: PropTypes.string,
        suffix: PropTypes.string,
        headline: PropTypes.string,
        'headline-container': PropTypes.string
    })
}

CompoundLogo.Variant = Variant

export default CompoundLogo