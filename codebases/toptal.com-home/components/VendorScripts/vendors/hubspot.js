import React from 'react'

import ClientScript from '~/components/ClientScript'

const HubspotScripts = ({
    portalId,
    delay
}) => ( <
    >
    <
    ClientScript src = {
        `//js.hs-scripts.com/${portalId}.js`
    }
    delay = {
        delay
    }
    /> <
    ClientScript body = "var _hsq = window._hsq = window._hsq || [];" / >
    <
    />
)

export default HubspotScripts