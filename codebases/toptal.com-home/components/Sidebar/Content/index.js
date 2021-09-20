import React, {
    useEffect,
    useRef
} from 'react'
import {
    noop
} from 'lodash'

import {
    useSticky
} from '~/lib/hooks'

import './content.scss'

const probeFn = node => !!node ? .scrollTop

const Content = ({
    children,
    className,
    onScrollToggle = noop
}) => {
    const ref = useRef(null)
    const isSticky = useSticky(null, {
        controlRef: ref,
        probeFn
    })

    useEffect(() => {
        onScrollToggle(isSticky)
    }, [onScrollToggle, isSticky])

    return ( <
        div styleName = "content"
        className = {
            className
        } { ...{
                ref
            }
        } > {
            children
        } <
        /div>
    )
}

export default Content