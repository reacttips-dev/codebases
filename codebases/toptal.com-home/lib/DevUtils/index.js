import {
    isBrowser
} from '@toptal/frontier'
import React from 'react'

import Blank from '~/components/_atoms/Blank'

const DevUtils = () => {
    if (!isBrowser()) {
        return <Blank / >
    }
    const PaddingOverlay = React.lazy(() =>
        import ('~/lib/DevUtils/PaddingOverlay')
    )
    const GridOverlay = React.lazy(() =>
        import ('~/lib/DevUtils/GridOverlay'))
    return ( <
        >
        <
        React.Suspense fallback = { < Blank / >
        } >
        <
        PaddingOverlay / >
        <
        /React.Suspense> <
        React.Suspense fallback = { < Blank / >
        } >
        <
        GridOverlay / >
        <
        /React.Suspense> <
        />
    )
}

export default DevUtils