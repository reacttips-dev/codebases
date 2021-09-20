import {
    isBrowser
} from '@toptal/frontier'
import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

export const OptimizelyEdge = ({
    projectId,
    enabled,
    pageGroups,
    pushkaApiUrl,
    pushkaScriptUrl
}) => {
    if (!enabled || !projectId) {
        return null
    }

    const snippetSrc = `/optimizely-edge/${projectId}.js`
    const configScript = `
(function () {
  window.optimizelyGroups = ${JSON.stringify(pageGroups)};
  window._pushkaConfig = {apiUrl: "${pushkaApiUrl}"};
})();
  `

    return (!isBrowser() && ( <
        Helmet >
        <
        link rel = "preload"
        href = {
            snippetSrc
        }
        as = "script" / >
        <
        link rel = "preconnect"
        href = "//logx.optimizely.com" / >
        <
        script type = "text/javascript" > {
            configScript
        } < /script> <
        script src = {
            snippetSrc
        }
        /> <
        script src = {
            pushkaScriptUrl
        }
        /> <
        /Helmet>
    ))
}

OptimizelyEdge.propTypes = {
    projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    enabled: PropTypes.bool,
    pageGroups: PropTypes.arrayOf(PropTypes.string),
    pushkaApiUrl: PropTypes.string,
    pushkaScriptUrl: PropTypes.string
}

export default OptimizelyEdge