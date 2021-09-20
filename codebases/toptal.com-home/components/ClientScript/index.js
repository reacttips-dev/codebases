import {
    useEffect
} from 'react'
import PropTypes from 'prop-types'

const injectScript = (src, text) => {
    const script = document.createElement('script')

    if (src) {
        script.src = src
    } else if (text) {
        script.text = text
    }

    document.body.appendChild(script)
}

const ClientScript = ({
    body: text,
    delay = 0,
    src
}) => {
    useEffect(
        () => {
            if (src || text) {
                const loadScript = () => injectScript(src, text)
                delay ? setTimeout(loadScript, delay) : loadScript()
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return null
}

ClientScript.propTypes = {
    body: PropTypes.string,
    delay: PropTypes.number,
    src: PropTypes.string
}

export default ClientScript