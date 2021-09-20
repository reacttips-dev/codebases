import React, {
    useEffect,
    useState
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import isVisualRegressionTest from '~/lib/is-visual-regression-test'

import './carousel.scss'

const Carousel = ({
    numberOfSlides,
    defaultActiveItemIndex = 0,
    changeInterval = 5000,
    children,
    style,
    className
}) => {
    const [activeItemIndex, setActiveItemIndex] = useState(defaultActiveItemIndex)

    useEffect(() => {
        if (isVisualRegressionTest) {
            return
        }
        const timerId = setTimeout(
            () => setActiveItemIndex((activeItemIndex + 1) % numberOfSlides),
            changeInterval
        )
        return () => clearTimeout(timerId)
    }, [activeItemIndex, changeInterval, numberOfSlides])

    return ( <
        div styleName = "root"
        className = {
            className
        } { ...{
                style
            }
        } > {
            children(activeItemIndex)
        } <
        /div>
    )
}

export const Slide = ({
    active = false,
    style,
    className,
    children
}) => ( <
    div styleName = {
        classNames('slide', {
            active
        })
    }
    className = {
        className
    } { ...{
            style
        }
    } >
    {
        children
    } <
    /div>
)

Carousel.propTypes = {
    numberOfSlides: PropTypes.number.isRequired,
    defaultActiveItemIndex: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
    changeInterval: PropTypes.number,
    children: PropTypes.func.isRequired
}

export default Carousel