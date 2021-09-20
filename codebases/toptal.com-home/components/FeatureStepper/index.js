import React from 'react'
import 'intersection-observer'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    revealConfig,
    useInView
} from '~/lib/hooks/use-in-view'
import isVisualRegressionTest from '~/lib/is-visual-regression-test'
import unorphan from '~/lib/unorphan'
import {
    CollectionPropTypes,
    VariantPropTypes
} from '~/lib/prop-types'
import getVariants from '~/lib/get-variants'

import {
    ChevronRightLargeIcon
} from '~/components/_atoms/Icons'
import {
    PageSection
} from '~/components/Library'
import Grid, {
    Cell
} from '~/components/Grid'
import {
    gridSize
} from '~/components/Grid/lib'
import HtmlContent from '~/components/HtmlContent'

import './feature-stepper.scss'

const Steps = ({
    items
}) => {
    const arrow = ( <
        div styleName = "step-arrow" >
        <
        ChevronRightLargeIcon styleName = "chevron-icon" / >
        <
        /div>
    )

    const stepWidth = gridSize / items.length

    const [ref, inView] = useInView(revealConfig)

    const steps = ( <
        div styleName = "steps-container" >
        <
        Grid styleName = {
            classNames('steps', {
                'is-static': isVisualRegressionTest
            })
        }
        role = "list" >
        {
            items.map(({
                title,
                description
            }, index) => ( <
                Cell key = {
                    index
                }
                tablet = {
                    stepWidth
                }
                styleName = "step-container"
                role = "listitem" >
                <
                div styleName = "step" > {
                    index === 0 && arrow
                } <
                div styleName = "step-number" > {
                    index + 1
                } < /div> {
                    arrow
                } <
                div styleName = "step-content" >
                <
                h3 styleName = "step-title"
                data - id = "step-title" > {
                    title
                } <
                /h3> <
                div styleName = "step-description" > {
                    unorphan(description)
                } < /div> <
                /div> <
                /div> <
                /Cell>
            ))
        } <
        /Grid> <
        /div>
    )

    if (isVisualRegressionTest) {
        return steps
    }

    return ( <
        div ref = {
            ref
        }
        styleName = {
            classNames({
                'steps-animated': inView
            })
        } > {
            steps
        } <
        /div>
    )
}

const Variant = {
    Theme: {
        DarkBlue: 'dark-blue',
        LightBlue: 'light-blue'
    },

    Align: {
        Center: 'center',
        Left: 'left'
    }
}

const FeatureStepper = ({
    title,
    items,
    className,
    theme,
    align = Variant.Align.Center
}) => ( <
    div styleName = {
        classNames('container', getVariants({
            theme,
            align
        }))
    }
    className = {
        className
    } >
    <
    PageSection semantic width = {
        PageSection.Variant.Width.Fixed
    }
    space = {
        PageSection.Variant.Space.None
    } >
    <
    HtmlContent content = {
        unorphan(title)
    }
    as = "h2"
    isUnstyled styleName = "title"
    dataId = "feature-stepper-title" /
    >

    <
    Steps { ...{
            items
        }
    }
    /> <
    /PageSection> <
    /div>
)

FeatureStepper.propTypes = {
    title: PropTypes.string.isRequired,
    items: CollectionPropTypes({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired,
    className: PropTypes.string,
    theme: VariantPropTypes(Variant.Theme),
    align: VariantPropTypes(Variant.Align)
}

FeatureStepper.Variant = Variant

export default FeatureStepper