import React, {
    useEffect,
    useCallback
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
    first,
    noop
} from 'lodash'
import {
    FocusVisibleManager
} from 'use-focus-visible'

import getVariants, {
    getBooleanVariants
} from '~/lib/get-variants'
import {
    useHorizontalScrollTo
} from '~/lib/hooks'

import {
    trackGAEvent
} from '~/components/VendorScripts/vendors/google-analytics'

import Tab from './Tab'
import {
    Theme
} from './lib/constants'
import {
    ThemePropTypes
} from './lib/prop-types'

import './tabs.scss'

const Item = ({
    children
}) => children

Item.propTypes = {
    id: PropTypes.any.isRequired,
    title: PropTypes.node.isRequired,
    iconUrl: PropTypes.string,
    iconAlt: PropTypes.string,
    titleAs: PropTypes.string
}

const Variant = {
    Theme
}

/**
 * Tabs component
 * @description Direct children of this component need to be multiple Tabs.Item components
 */
const Tabs = ({
    value,
    className,
    onlyHeaderTabs,
    onlyRenderActive,
    children: tabs,
    onChange = noop,
    theme,
    gaCategory,
    gaEvent,
    gaLabelUseTabId = false,
    styles = {},
    ...restProps
}) => {
    const {
        containerRef,
        itemsRefs,
        scrollToXCenter
    } = useHorizontalScrollTo(
        tabs.length
    )

    const activeTabIndex = tabs.findIndex(tab => tab.props.id === value)

    useEffect(() => {
        if (activeTabIndex !== -1) {
            scrollToXCenter(itemsRefs.current[activeTabIndex])
        } else {
            // Try to recover from an invalid tab value
            onChange(first(tabs).props.id)
        }
    }, [itemsRefs, tabs, activeTabIndex, onChange, scrollToXCenter])

    const handleTabClick = useCallback(
        (tabId, index) => {
            onChange(tabId)

            if (gaCategory && gaEvent) {
                const gaLabel = gaLabelUseTabId ?
                    tabId.toLowerCase().replaceAll(' ', '_') :
                    `tab_number_${index + 1}`

                trackGAEvent(gaCategory, gaEvent, gaLabel)
            }
        }, [onChange, gaCategory, gaEvent, gaLabelUseTabId]
    )

    const switchTab = useCallback(
        newIndex => {
            if (tabs[newIndex]) {
                handleTabClick(tabs[newIndex].props.id, newIndex)
                itemsRefs.current[newIndex].current.focus()
            }
        }, [handleTabClick, itemsRefs, tabs]
    )

    const handleHeaderListKeyDown = useCallback(
        e => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                switchTab(activeTabIndex - 1)
            }

            if (e.key === 'ArrowRight') {
                e.preventDefault()
                switchTab(activeTabIndex + 1)
            }
        }, [switchTab, activeTabIndex]
    )

    return ( <
        div className = {
            className
        }
        styleName = {
            classNames(getVariants({
                theme
            }))
        } { ...restProps
        } >
        <
        ul styleName = "header-list"
        ref = {
            containerRef
        }
        className = {
            styles.header
        }
        role = "tablist"
        onKeyDown = {
            handleHeaderListKeyDown
        } >
        {
            tabs.map(
                ({
                        props: {
                            id: tabId,
                            title,
                            iconUrl,
                            iconAlt,
                            titleAs
                        }
                    },
                    index
                ) => ( <
                    FocusVisibleManager key = {
                        tabId
                    } >
                    <
                    Tab isActive = {
                        value === tabId
                    } { ...{
                            tabId,
                            index,
                            itemsRefs,
                            iconUrl,
                            iconAlt,
                            title,
                            handleTabClick,
                            theme,
                            titleAs
                        }
                    }
                    /> <
                    /FocusVisibleManager>
                )
            )
        } <
        /ul>

        {
            !onlyHeaderTabs && ( <
                div > {
                    tabs.map(({
                        props: {
                            id: tabId,
                            children
                        }
                    }) => {
                        const isActive = value === tabId

                        if (onlyRenderActive && !isActive) {
                            return null
                        }

                        return ( <
                            div key = {
                                tabId
                            }
                            styleName = {
                                classNames(
                                    'content',
                                    getBooleanVariants({
                                        isActive
                                    })
                                )
                            }
                            role = "tabpanel" >
                            {
                                children
                            } <
                            /div>
                        )
                    })
                } <
                /div>
            )
        } <
        /div>
    )
}

Tabs.Item = Item
Tabs.Variant = Variant

Tabs.propTypes = {
    /**
     * Needs to be Tabs.Item components
     */
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    /**
     * To display only tab headers (no content)
     */
    onlyHeaderTabs: PropTypes.bool,
    /**
     * Renders a tab content only when it becomes active - for better performance
     */
    onlyRenderActive: PropTypes.bool,
    /**
     * Called after the user clicks on a tab on the header
     */
    onChange: PropTypes.func,
    /**
     * Use it to control the currently selected tab
     */
    value: PropTypes.string,
    /**
     * Controls the appearance of tab headers
     */
    theme: ThemePropTypes,
    /**
     * Styles for customizing specific parts
     */
    styles: PropTypes.shape({
        header: PropTypes.string
    }),
    /**
     * GA category and event. Will track tab clicks if specified
     */
    gaCategory: PropTypes.string,
    gaEvent: PropTypes.string,
    /**
     * Determine if gaLabel is taken from tabId value or default index based numbering e.g. tab_number_1
     */
    gaLabelUseTabId: PropTypes.bool
}

export default Tabs