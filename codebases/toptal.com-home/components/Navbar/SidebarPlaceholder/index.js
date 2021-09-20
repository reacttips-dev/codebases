import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react'
import PropTypes from 'prop-types'
import {
    isBrowser
} from '@toptal/frontier'
import {
    noop
} from 'lodash'

import {
    useToggle,
    useGraphQL
} from '~/lib/hooks'
import isIE11 from '~/lib/is-ie11'
import {
    isError
} from '~/lib/fetch-status'

import Sidebar from '~/components/Sidebar'
import sidebarQuery from '~/components/Sidebar/lib/graphql/sidebar.graphql'
import {
    State,
    trackSidebarToggle
} from '~/components/Sidebar/lib/google-analytics'
import {
    enableSearch,
    shouldEnableSearch
} from '~/components/SearchWidget/lib/util'

import {
    getSidebarProps
} from './util'
import Toggle from './Toggle'

const transformData = ({
    data
}) => data.sidebar

let resolver = noop

const dataRequest = new Promise(resolve => {
    resolver = resolve
})

const SidebarPlaceholder = ({
    sidebar,
    classes = {}
}) => {
    const [isSidebarOpen, toggleIsSidebarOpen] = useToggle(false)
    const [isFirstOpen, setIsFirstOpen] = useState(false)

    const {
        kind,
        graphqlUrl
    } = sidebar

    const variables = useMemo(
        () => ({
            kind
        }), [kind]
    )

    const {
        request,
        data,
        status
    } = useGraphQL(
        graphqlUrl,
        sidebarQuery,
        variables, {
            transformData
        }
    )

    const handleToggle = useCallback(
        isOpen => {
            if (isBrowser() && !isIE11()) {
                if (isOpen) {
                    trackSidebarToggle(State.Open, kind)

                    if (!isFirstOpen) {
                        setIsFirstOpen(true)

                        request().finally(resolver)
                    }
                }

                toggleIsSidebarOpen()
            }
        }, [toggleIsSidebarOpen, isFirstOpen, kind, request]
    )

    const sidebarProps = useMemo(() => getSidebarProps(sidebar, data), [
        data,
        sidebar
    ])

    const handleDismiss = useCallback(() => {
        handleToggle()
        trackSidebarToggle(State.Close, kind)
    }, [handleToggle, kind])

    useEffect(() => {
        if (shouldEnableSearch()) {
            enableSearch()
        }
    }, [])

    return ( <
        >
        <
        Toggle open = {
            isSidebarOpen
        }
        onToggle = {
            handleToggle
        }
        className = {
            classes.toggle
        }
        />

        <
        Sidebar isOpen = {
            isSidebarOpen
        }
        onDismiss = {
            handleDismiss
        } { ...sidebarProps
        } { ...{
                isFirstOpen,
                dataRequest
            }
        }
        isError = {
            isError(status)
        }
        /> <
        />
    )
}

SidebarPlaceholder.propTypes = {
    sidebar: PropTypes.shape(Sidebar.dataPropTypes).isRequired,
    classes: PropTypes.shape({
        toggle: PropTypes.string.isRequired
    })
}

SidebarPlaceholder.displayName = 'SidebarPlaceholder'

export default SidebarPlaceholder