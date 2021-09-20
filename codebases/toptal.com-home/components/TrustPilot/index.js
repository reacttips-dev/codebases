import React from 'react'
import PropTypes from 'prop-types'

import loadScript from '~/lib/load-script'
import callOnFirstScroll from '~/lib/call-on-first-scroll'

export const TrustPilotTheme = {
    Light: 'light'
}

const TrustPilotHeight = {
    Small: 28,
    Large: 140
}

const TrustPilot = ({
    templateId,
    businessUnitId,
    locale,
    height,
    width,
    theme,
    href,
    loadOnFirstScroll = false,
    disableSEOSnippet = false
}) => {
    const ref = React.useRef(null)
    const loadTrustpilotScript = async () => {
        await loadScript(
            '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js'
        )

        if (ref.current) {
            window.Trustpilot.loadFromElement(ref.current, true)
        }
    }

    React.useEffect(() => {
        if (loadOnFirstScroll) {
            callOnFirstScroll(loadTrustpilotScript)
        } else {
            loadTrustpilotScript()
        }
    }, [templateId, loadOnFirstScroll])

    // This is required to exclude inserted by TrustPilot structured data on the Homepage.
    // https://support.trustpilot.com/hc/en-us/articles/227922808#implement-guide
    // See PUB-556
    const rest = {}

    if (!disableSEOSnippet) {
        rest['data-schema-type'] = 'Organization'
    }

    return ( <
        div className = "trustpilot-widget"
        data - businessunit - id = {
            businessUnitId
        }
        data - locale = {
            locale
        }
        data - style - width = {
            width
        }
        data - style - height = {
            height
        }
        data - template - id = {
            templateId
        }
        data - theme = {
            theme
        }
        data - stars = "5" { ...rest
        } { ...{
                ref
            }
        }
        data - happo - hide >
        <
        a { ...{
                href
            }
        }
        target = "_blank"
        rel = "noreferrer noopener" / >
        <
        /div>
    )
}

TrustPilot.Height = TrustPilotHeight

TrustPilot.propTypes = {
    templateId: PropTypes.string.isRequired,
    businessUnitId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.string,
    theme: PropTypes.string,
    href: PropTypes.string.isRequired,
    loadOnFirstScroll: PropTypes.bool,
    disableSEOSnippet: PropTypes.bool
}

TrustPilot.FullWidth = props => ( <
    TrustPilot width = "100%"
    height = {
        TrustPilotHeight.Large
    }
    theme = {
        TrustPilotTheme.Light
    } { ...props
    }
    />
)

export default TrustPilot