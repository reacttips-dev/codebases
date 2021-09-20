import React from 'react'
import {
    CSSTransition
} from 'react-transition-group'
import classNames from 'classnames'

import isVisualRegressionTest from '~/lib/is-visual-regression-test'
import {
    useOutsideClick
} from '~/lib/hooks'
import {
    getBooleanVariants
} from '~/lib/get-variants'

import {
    TRANSITION_DURATION
} from '../lib/constants'
import {
    getTransitionStyles
} from '../lib/utils'

import styles from './panel.scss'

const transitionStyles = getTransitionStyles(styles)

const Panel = ({
    children,
    parentRef,
    isOpen,
    onDismiss
}) => {
    const ref = useOutsideClick(onDismiss, parentRef)

    return ( <
        CSSTransition in = {
            isOpen
        }
        appear timeout = {
            TRANSITION_DURATION
        } { ...(!isVisualRegressionTest && {
                classNames: transitionStyles
            })
        } >
        <
        div styleName = {
            classNames(
                'container',
                getBooleanVariants({
                    isVisualRegressionTest
                })
            )
        } { ...{
                ref
            }
        } >
        <
        div styleName = "content" > {
            children
        } < /div> <
        /div> <
        /CSSTransition>
    )
}

export default Panel