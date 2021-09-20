import React, {
    createContext,
    useMemo
} from 'react'
import PropTypes from 'prop-types'

import {
    SidebarKindPropTypes
} from './lib/prop-types'

export const SidebarContext = createContext({})

const ContextProvider = ({
    children,
    kind,
    graphqlUrl,
    topSearchResultsPageUrl
}) => {
    const value = useMemo(
        () => ({
            kind,
            graphqlUrl,

            topSearchResultsPageUrl
        }), [kind, graphqlUrl, topSearchResultsPageUrl]
    )

    return <SidebarContext.Provider { ...{
            children,
            value
        }
    }
    />
}

ContextProvider.propTypes = {
    kind: SidebarKindPropTypes.isRequired,
    graphqlUrl: PropTypes.string.isRequired,
    topSearchResultsPageUrl: PropTypes.string.isRequired
}

export default ContextProvider