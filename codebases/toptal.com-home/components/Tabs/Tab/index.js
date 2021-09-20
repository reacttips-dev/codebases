import React, {
    useCallback
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
    useFocusVisible
} from 'use-focus-visible'

import getVariants, {
    getBooleanVariants
} from '~/lib/get-variants'

import LazyLoadImage from '~/components/_atoms/LazyLoadImage'

import {
    ThemePropTypes
} from '../lib/prop-types'

import './tab.scss'

const Tab = ({
    as: Element = 'li',
    isActive,
    tabId,
    index,
    itemsRefs,
    iconUrl,
    title,
    handleTabClick,
    theme,
    iconAlt,
    titleAs: TitleElement = 'div'
}) => {
    const {
        focusVisible,
        onFocus,
        onBlur
    } = useFocusVisible()
    const handleClick = useCallback(() => handleTabClick(tabId, index), [
        handleTabClick,
        tabId,
        index
    ])

    return ( <
        Element role = "tab"
        aria - selected = {
            isActive
        }
        tabIndex = {
            isActive ? 0 : -1
        }
        ref = {
            itemsRefs.current[index]
        }
        onBlur = {
            onBlur
        }
        onFocus = {
            onFocus
        }
        onClick = {
            handleClick
        }
        styleName = {
            classNames(
                'header',
                getVariants({
                    theme
                }),
                getBooleanVariants({
                    isActive,
                    focusVisible
                })
            )
        } >
        {!!iconUrl && ( <
                TitleElement styleName = "icon-wrapper" >
                <
                LazyLoadImage styleName = "icon"
                src = {
                    iconUrl
                }
                alt = {
                    iconAlt || title
                }
                /> <
                /TitleElement>
            )
        }

        <
        TitleElement styleName = "title"
        data - id = "tab-title"
        data - title = {
            title
        } > {
            title
        } <
        /TitleElement> <
        /Element>
    )
}

Tab.propTypes = {
    as: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    tabId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    itemsRefs: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({
            current: PropTypes.arrayOf(PropTypes.object)
        })
    ]).isRequired,
    iconUrl: PropTypes.string,
    iconAlt: PropTypes.string,
    title: PropTypes.node.isRequired,
    handleTabClick: PropTypes.func.isRequired,
    theme: ThemePropTypes
}

export default Tab