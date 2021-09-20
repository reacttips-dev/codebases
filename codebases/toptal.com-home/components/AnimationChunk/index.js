import React, {
    useEffect,
    useState
} from 'react'
import PropTypes from 'prop-types'

import isVisualRegressionTest from '~/lib/is-visual-regression-test'
import makeCancellablePromise from '~/lib/cancellable-promise'

/**
 * AnimationChunk helps to organize talents animations on VLP.
 * Take a look into stories of the component to get the idea.
 */
const AnimationChunk = ({
    shiftX = '0',
    shiftY = '0',
    shiftDuration = 0.4,
    scale = 1,
    scaleDuration = 1,
    opacity = 1,
    opacityDuration = 0.4,
    postponeTransition = Promise.resolve(),
    className = '',
    as: Element = 'div',
    animated = true,
    children
}) => {
    const [currOpacity, setOpacity] = useState(opacity)
    const [translateX, setTranslateX] = useState(shiftX)
    const [translateY, setTranslateY] = useState(shiftY)
    const [currScale, setScale] = useState(scale)

    const isAnimated = animated && !isVisualRegressionTest

    useEffect(() => {
        const promise = makeCancellablePromise(
            isAnimated ? postponeTransition : Promise.resolve()
        )

        promise
            .then(() => {
                setOpacity(1)
                setTranslateX(0)
                setTranslateY(0)
                setScale(1)
            })
            .catch(() => {})

        return () => promise.cancel()
    }, [postponeTransition, isAnimated])

    return ( <
        Element style = {
            {
                opacity: currOpacity,
                transform: `translate(${translateX}, ${translateY}) scale(${currScale})`,
                transition: isAnimated ?
                    `opacity ${opacityDuration}s, transform ${shiftDuration}s, scale ${scaleDuration}s` :
                    'none'
            }
        }
        className = {
            className
        } >
        {
            children
        } <
        /Element>
    )
}

const AnimationChunkPropTypes = {
    shift: PropTypes.string,
    shiftDuration: PropTypes.number,
    opacity: PropTypes.number,
    opacityDuration: PropTypes.number,
    scale: PropTypes.number,
    scaleDuration: PropTypes.number,
    postponeTransition: PropTypes.instanceOf(Promise),
    className: PropTypes.string,
    as: PropTypes.oneOf(['div', 'li'])
}

AnimationChunk.propTypes = AnimationChunkPropTypes

export default AnimationChunk