import React, {
    Suspense,
    useMemo
} from 'react'
import PropTypes from 'prop-types'
import {
    noop
} from 'lodash'

import Blank from '~/components/_atoms/Blank'
import Spinner from '~/components/_atoms/Spinner'
import LoadingError from '~/components/Sidebar/LoadingError'

import {
    Kind
} from './lib/constants'
import Controller from './Controller'
import ContextProvider from './ContextProvider'

import './sidebar.scss'

const Loader = () => ( <
    div styleName = "loader" >
    <
    Spinner / >
    <
    /div>
)

const Sidebar = ({
    isOpen,
    onDismiss = noop,
    onLoad = noop,
    kind,
    graphqlUrl,
    topSearchResultsPageUrl,
    dataRequest,
    isError,
    isFirstOpen,
    ...sections
}) => {
    const SectionList = useMemo(() => {
        if (isFirstOpen) {
            return React.lazy(async () => {
                const promise =
                    import ('./SectionList')
                await Promise.all([promise, dataRequest])
                onLoad()

                return promise
            })
        }

        return Blank
    }, [onLoad, isFirstOpen, dataRequest])

    return ( <
        Controller { ...{
                isOpen,
                onDismiss
            }
        } >
        <
        Suspense fallback = { < Loader / >
        } > {
            isError && < LoadingError / >
        }

        {
            !isError && ( <
                ContextProvider { ...{
                        kind,
                        graphqlUrl,
                        topSearchResultsPageUrl
                    }
                } >
                <
                SectionList { ...{
                        sections
                    }
                }
                /> <
                /ContextProvider>
            )
        } <
        /Suspense> <
        /Controller>
    )
}

Sidebar.dataPropTypes = ContextProvider.propTypes

Sidebar.propTypes = {
    ...Sidebar.dataPropTypes,
    isOpen: PropTypes.bool,
    isFirstOpen: PropTypes.bool,
    onLoad: PropTypes.func,
    onDismiss: PropTypes.func,
    isError: PropTypes.bool,
    sections: PropTypes.elementType,
    dataRequest: PropTypes.instanceOf(Promise)
}

Sidebar.ContextProvider = ContextProvider
Sidebar.Kind = Kind

export default Sidebar