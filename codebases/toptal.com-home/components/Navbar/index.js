import React, {
    useState,
    useMemo,
    useCallback,
    useRef,
    useEffect
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import 'whatwg-fetch'
import {
    noop,
    debounce
} from 'lodash'

import queryRange from '~/lib/query-range'
import isVisualRegressionTest from '~/lib/is-visual-regression-test'
import getVariants, {
    getBooleanVariants
} from '~/lib/get-variants'
import {
    Breakpoints
} from '~/lib/constants'
import {
    gaDataset
} from '~/lib/ga-helpers'
import {
    useAuthState,
    AuthState
} from '~/lib/hooks'
import {
    useAnchorNav
} from '~/lib/hooks/use-anchor-nav'
import {
    LinkableEntityWithGAArray,
    LinkableEntityPropTypes,
    LinkableEntityPropTypesShape,
    LinkableEntityWithGAPropTypes,
    VariantPropTypes,
    CollectionPropTypes
} from '~/lib/prop-types'

import MatchMedia from '~/components/MatchMedia'
import AnimationChunk from '~/components/AnimationChunk'
import StickyContainer from '~/components/StickyContainer'
import BurgerMenuButton from '~/components/BurgerMenuButton'
import GenericLink from '~/components/_atoms/GenericLink'
import CompoundLogo from '~/components/CompoundLogo'
import {
    ChevronRightIcon
} from '~/components/_atoms/Icons'
import {
    Link
} from '~/components/CTA'
import Sidebar from '~/components/Sidebar'

import SidebarPlaceholder from './SidebarPlaceholder'
import NavbarBreakpoints from './breakpoints'
import {
    isSelected
} from './lib/helpers'
import styles from './navbar.scss'

const LinkVariant = {
    White: 'white',
    Highlight: 'highlight',
    Blue: 'blue',
    SecondaryBlue: 'secondary-blue'
}

const linkStyleToTheme = {
    [LinkVariant.White]: Link.Variant.Theme.SecondaryFlat,
    [LinkVariant.Highlight]: Link.Variant.Theme.PrimaryGreen,
    [LinkVariant.Blue]: Link.Variant.Theme.PrimaryBlue,
    [LinkVariant.SecondaryBlue]: Link.Variant.Theme.SecondaryBlue
}

const Variant = {
    Dark: 'dark',
    Logo: {
        Layout: CompoundLogo.Variant.Layout,
        Type: CompoundLogo.Variant.Type
    }
}

const NavAction = ({
    href,
    label,
    style,
    gaCategory,
    gaEvent,
    gaLabel,
    inlineStyles,
    open
}) => {
    const isText = !style || style === LinkVariant.White
    const theme =
        isText && open ?
        Link.Variant.Theme.SecondaryGrey :
        linkStyleToTheme[style] || Link.Variant.Theme.SecondaryFlat

    /* FIXME: Checking button label is hacky, this should be passed from Blackfish probably */
    return ( <
        Link size = {
            Link.Variant.Size.Medium
        }
        styleName = {
            classNames(
                'action-link',
                getBooleanVariants({
                    text: isText && !open
                })
            )
        }
        style = {
            inlineStyles
        }
        data - id = "nav_cta" { ...{
                href,
                label,
                theme,
                gaCategory,
                gaEvent,
                gaLabel
            }
        } { ...(label === 'Log In' && {
                rel: 'nofollow'
            })
        }
        />
    )
}

const NavActions = ({
    links,
    className,
    type = '',
    isLoggedIn,
    isLoggedOut,
    open
}) => {
    const filteredLinks =
        type === 'login-cta' ?
        links.filter(
            ({
                isAuthAgnostic,
                forLoggedIn
            }) =>
            isAuthAgnostic ||
            (isLoggedIn && forLoggedIn) ||
            (isLoggedOut && !forLoggedIn)
        ) :
        links

    if (!filteredLinks.length) {
        return null
    }

    return ( <
        ul styleName = "navigation"
        className = {
            className
        } > {
            filteredLinks.map(link => ( <
                li key = {
                    link.href
                }
                styleName = "item" >
                <
                NavAction { ...link
                } { ...{
                        open
                    }
                }
                /> <
                /li>
            ))
        } <
        /ul>
    )
}

const NavLink = ({
    label,
    href,
    gaCategory,
    gaEvent,
    gaLabel,
    onClick,
    selectedSlug
}) => {
    const handleClick = useCallback(
        event => {
            href ? .startsWith('#') && onClick && onClick(event)
        }, [href, onClick]
    )

    return ( <
        GenericLink onClick = {
            handleClick
        }
        styleName = {
            classNames(
                'nav-item nav-link',
                getBooleanVariants({
                    selected: isSelected(href, selectedSlug)
                })
            )
        } { ...gaDataset(gaCategory, gaEvent, gaLabel)
        } { ...{
                href
            }
        } >
        {
            label
        } <
        /GenericLink>
    )
}

const NavDropdown = ({
    isVertical,
    children,
    label,
    gaCategory,
    gaEvent,
    gaLabel
}) => {
    const [isExpanded, setIsExpanded] = useState(isVisualRegressionTest)
    const [containerProps, setContainerProps] = useState({})
    const containerRef = useRef(null)
    const headRef = useRef(null)

    // In integration tests the headless browser will be clicking links
    // emulating the user hovered over the link, so 'onmouseenter' is triggered.
    // The same behavior is observed when clicking the menu in responsive mode
    const setIsExpandedDebounced = useCallback(
        debounce(setIsExpanded, 10, {
            leading: true,
            trailing: false
        }), []
    )

    const handleMouseLeave = useCallback(
        debounce(
            () => {
                !isVertical && setIsExpandedDebounced(false)
            },
            200, {
                leading: false,
                trailing: true
            }
        ), [isVertical, setIsExpandedDebounced]
    )

    const handleMouseEnter = useCallback(() => {
        if (!isVertical) {
            handleMouseLeave.cancel()
            setIsExpandedDebounced(true)
        }
    }, [isVertical, setIsExpandedDebounced, handleMouseLeave])

    const handleKeyDown = useCallback(
        e => {
            switch (e.key) {
                case 'Enter':
                    setIsExpandedDebounced(isExpanded => !isExpanded)
                    break

                case 'Escape':
                    setIsExpandedDebounced(false)
                    headRef.current ? .focus()
                    break
            }
        }, [setIsExpandedDebounced]
    )

    const handleMouseDown = useCallback(e => {
        // Prevent browsers to set focus on the dropdown menu header
        // since :focus-visible is either not supported or implementation
        // specific which leads to rendering a ring outline around the header
        e.preventDefault()
    }, [])

    const handleHeadClick = useCallback(() => {
        setIsExpandedDebounced(isExpanded => !isExpanded)
    }, [setIsExpandedDebounced])

    useEffect(() => {
        if (isVertical && isExpanded) {
            const style = {
                flexBasis: containerRef.current.scrollHeight
            }
            setContainerProps({
                style
            })
        }

        return () => setContainerProps({})
    }, [isVertical, isExpanded])

    return ( <
        div styleName = {
            classNames(
                'nav-item nav-dropdown',
                getBooleanVariants({
                    isExpanded,
                    isVisualRegressionTest
                })
            )
        }
        onMouseEnter = {
            handleMouseEnter
        }
        onMouseLeave = {
            handleMouseLeave
        }
        onKeyDown = {
            handleKeyDown
        }
        ref = {
            containerRef
        } { ...containerProps
        } >
        <
        button tabIndex = "0"
        aria - haspopup = "true"
        aria - expanded = {
            isExpanded
        }
        onClick = {
            handleHeadClick
        }
        onMouseDown = {
            handleMouseDown
        }
        styleName = "nav-link nav-dropdown-head"
        ref = {
            headRef
        } { ...gaDataset(gaCategory, gaEvent, gaLabel)
        } >
        <
        span > {
            label
        } < /span> <
        ChevronRightIcon styleName = "nav-dropdown-chevron" / >
        <
        /button> <
        div styleName = "nav-dropdown-body"
        role = "menu"
        data - happo - hide > {
            children.map(({
                label,
                href,
                gaCategory,
                gaEvent,
                gaLabel
            }) => ( <
                GenericLink key = {
                    href
                }
                role = "menuitem"
                styleName = "nav-dropdown-body-link" { ...gaDataset(gaCategory, gaEvent, gaLabel)
                } { ...{
                        href
                    }
                } >
                {
                    label
                } <
                /GenericLink>
            ))
        } <
        /div> <
        /div>
    )
}

const NavLinks = ({
    isVertical,
    links,
    onClick,
    selectedSlug
}) => ( <
    div styleName = "links-container" > {
        links.map(link => {
            const Component = link.children ? .length ? NavDropdown : NavLink

            return ( <
                Component key = {
                    link.href || link.label
                } { ...link
                } { ...{
                        isVertical,
                        onClick,
                        selectedSlug
                    }
                }
                />
            )
        })
    } <
    /div>
)

const NavbarContent = ({
    navigationLinks,
    ctaPersistentLinks,
    ctaLinks,
    selectedSlug,
    open,
    isLoggedIn,
    isLoggedOut,
    onItemClick,
    upperBreakpoint
}) => {
    const navActionsFactory = useMemo(
        () => customLinks => ( <
            NavActions { ...{
                    isLoggedIn,
                    isLoggedOut
                }
            }
            links = {
                customLinks || ctaLinks
            }
            type = "login-cta"
            styleName = "actions-container" { ...{
                    open
                }
            }
            />
        ), [ctaLinks, isLoggedIn, isLoggedOut, open]
    )
    const navActionsDefault = useMemo(() => navActionsFactory(), [
        navActionsFactory
    ])
    const navActionsWithoutPersistent = useMemo(
        () =>
        navActionsFactory(ctaLinks.filter(item => !item.preserveWhenCollapsed)), [navActionsFactory, ctaLinks]
    )
    const showDefaultActions = open || !ctaPersistentLinks.length
    const links = navigationLinks.filter(
        ({
            href,
            children
        }) => href || children ? .length
    )

    return ( <
        >
        <
        NavLinks onClick = {
            onItemClick
        }
        isVertical = {
            open
        } { ...{
                links,
                selectedSlug
            }
        }
        />

        {
            showDefaultActions ? (
                navActionsDefault
            ) : ( <
                >
                <
                MatchMedia defaultMatch query = {
                    queryRange(Breakpoints.TABLET, upperBreakpoint)
                } >
                <
                NavActions links = {
                    ctaPersistentLinks
                }
                styleName = "is-persistent" / > {
                    navActionsWithoutPersistent
                } <
                /MatchMedia> <
                MatchMedia query = {
                    queryRange(upperBreakpoint)
                } > {
                    navActionsDefault
                } <
                /MatchMedia> <
                />
            )
        } <
        />
    )
}

const Navbar = ({
    logo,
    onItemClick,
    navbarData,
    className,
    sticky,
    variant,
    selected = '',
    platformSessionUrl,
    sidebar,
    forcedOpen,
    height = 64,
    children,
    onOpen = noop,
    upperBreakpoint = Breakpoints.DESKTOP_LARGE
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const {
        navigationLinks,
        ctaLinks,
        logoLink,
        title: headline
    } = navbarData
    const ctaPersistentLinks = ctaLinks.filter(link => link.preserveWhenCollapsed)
    const [authState] = useAuthState(platformSessionUrl)
    const [preventDoubleNav] = useAnchorNav(-height)

    const handleSetOpen = useCallback(
        value => {
            setIsOpen(value)
            onOpen(value)
        }, [onOpen]
    )

    const handleItemClick = useCallback(
        event => {
            preventDoubleNav(event)
            handleSetOpen(false)
            onItemClick && onItemClick(event)
        }, [onItemClick, preventDoubleNav, handleSetOpen]
    )

    const isExpanded = Boolean(isOpen || forcedOpen)

    const navbarContent = useMemo(
        () => selected => ( <
            NavbarContent { ...{
                    upperBreakpoint,
                    navigationLinks,
                    ctaPersistentLinks,
                    ctaLinks
                }
            }
            open = {
                isExpanded
            }
            selectedSlug = {
                selected
            }
            isLoggedIn = {
                authState === AuthState.LoggedIn
            }
            isLoggedOut = {
                authState === AuthState.LoggedOut
            }
            onItemClick = {
                handleItemClick
            }
            />
        ), [
            upperBreakpoint,
            authState,
            isExpanded,
            navigationLinks,
            ctaPersistentLinks,
            ctaLinks,
            handleItemClick
        ]
    )

    const content = useMemo(
        () => (isOnTop, selected) => ( <
            > {
                navbarContent(selected)
            } {
                children && children({
                    isOnTop,
                    isOpen,
                    setIsOpen: handleSetOpen
                })
            } <
            />
        ), [isOpen, children, navbarContent, handleSetOpen]
    )

    const showHamburger = !![...ctaLinks, ...navigationLinks].length || !!children

    return ( <
        StickyContainer isSticky = {!isVisualRegressionTest && sticky
        }
        className = {
            className
        }
        styleName = {
            classNames('container', getVariants(variant))
        } >
        {
            ({
                isOnTop
            }) => ( <
                div data - id = "nav-container"
                styleName = {
                    classNames('navbar', {
                        'has-persistent-cta': !!ctaPersistentLinks.length,
                        'is-open': isExpanded,
                        'is-sticky': isOnTop && sticky,
                        'is-spacious': upperBreakpoint === NavbarBreakpoints.DESKTOP_XLARGE
                    })
                } >
                {!!sidebar ? .kind && ( <
                        SidebarPlaceholder { ...{
                                sidebar
                            }
                        }
                        classes = {
                            {
                                toggle: styles['sidebar-toggle']
                            }
                        }
                        />
                    )
                }

                <
                div styleName = "logo-container" >
                <
                CompoundLogo href = {
                    logoLink.href
                }
                title = {
                    logoLink.label
                }
                isMonotone = {
                    variant === Variant.Dark && !isOnTop && !isOpen
                } { ...{
                        headline
                    }
                } { ...logo
                }
                /> <
                /div>

                {
                    showHamburger && ( <
                        BurgerMenuButton open = {
                            isExpanded
                        }
                        onToggle = {
                            handleSetOpen
                        }
                        styleName = "toggle" /
                        >
                    )
                }

                {
                    isOpen ? ( <
                        AnimationChunk opacity = {
                            0
                        }
                        styleName = "navbar-content-open" > {
                            content(isOnTop)
                        } <
                        /AnimationChunk>
                    ) : (
                        content(isOnTop, selected)
                    )
                } <
                /div>
            )
        } <
        /StickyContainer>
    )
}

Navbar.propTypes = {
    navbarData: PropTypes.shape({
        navigationLinks: CollectionPropTypes({
            ...LinkableEntityWithGAPropTypes,
            href: PropTypes.string,
            children: LinkableEntityWithGAArray
        }),
        ctaLinks: CollectionPropTypes({
            ...LinkableEntityPropTypes,
            forLoggedIn: PropTypes.bool,
            isAuthAgnostic: PropTypes.bool,
            preserveWhenCollapsed: PropTypes.bool,
            style: PropTypes.string
        }),
        logoLink: LinkableEntityPropTypesShape,
        title: PropTypes.string
    }),
    logo: PropTypes.shape({
        type: CompoundLogo.propTypes.type,
        layout: CompoundLogo.propTypes.layout,
        styles: CompoundLogo.propTypes.styles,
        suffix: CompoundLogo.propTypes.suffix,
        headlineAs: CompoundLogo.propTypes.headlineAs
    }),
    variant: VariantPropTypes(Variant),
    platformSessionUrl: PropTypes.string.isRequired,
    forcedOpen: PropTypes.bool,
    sidebar: PropTypes.shape({
        kind: Sidebar.propTypes.kind
    }),
    height: PropTypes.number,
    onItemClick: PropTypes.func,
    styles: PropTypes.shape({
        logoTitle: PropTypes.string
    }),
    upperBreakpoint: PropTypes.string,
    className: PropTypes.string,
    sticky: PropTypes.bool,
    onOpen: PropTypes.func
}

// To enable Navbar stickiness when the page is reloaded with scroll position > 0
Navbar.hydrationOptions = {
    defer: false
}

Navbar.LinkVariant = LinkVariant
Navbar.Variant = Variant
Navbar.Breakpoints = NavbarBreakpoints

export default Navbar