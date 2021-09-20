import 'intersection-observer'
import {
    useInView
} from 'react-intersection-observer'

const revealConfig = {
    delay: 500,
    triggerOnce: true
}

export {
    useInView,
    revealConfig
}