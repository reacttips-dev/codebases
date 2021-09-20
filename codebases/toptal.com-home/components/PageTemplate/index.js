import {
    isBrowser,
    getHydrated
} from '@toptal/frontier'
import React, {
    createContext
} from 'react'
import PropTypes from 'prop-types'
import {
    Helmet
} from 'react-helmet'

import DevUtils from '~/lib/DevUtils'
import toptalize from '~/lib/toptalize'
import {
    ExperimentsPropTypes
} from '~/lib/prop-types'
import {
    ExternalScripts,
    getDisabledExternalScripts
} from '~/lib/get-disabled-external-scripts'

import Favicon from '~/components/Favicon'
import RelPreconnector from '~/components/RelPreconnector'
import {
    ModalHost
} from '~/components/_atoms/Modal/Host'
import OptimizelyEdge from '~/components/OptimizelyEdge'
import OptimizelyWeb from '~/components/OptimizelyWeb'
import SidebarHost from '~/components/Sidebar/Host'
import CookieBanner from '~/components/CookieBanner'

import FontAssetsPreloader from './font-assets-preloader'
import InteractiveComponents from './interactive-components'

import '~/styles/common.scss'

const hydrated = getHydrated('template')
const HydratedInteractiveComponents = hydrated(InteractiveComponents, {
    defer: false,
    atIdle: true
})

const HydratedDevUtils = hydrated(DevUtils, {
    atIdle: true
})

export const PageContext = createContext({})

/**
 * Holds the logic for rendering anything in the <head>, the Cookie banner,
 * and 3rd party scripts.
 */
const PageTemplate = ({
        children,
        requestMetadata,
        page: {
            publicUrl,
            bounceModals,
            vertical,
            seo,
            slug
        },
        isPartiallyHydrated,
        isSidebarEnabled,
        showCookieBanner = true,
        toptalizeTitles,
        trackScrollDepth,
        className
    }) => {
        const disabledScripts = getDisabledExternalScripts(requestMetadata)

        const interactiveComponentsProps = {
            requestMetadata,
            bounceModals,
            vertical,
            slug,
            publicUrl,
            trackScrollDepth,
            showCookieBanner,
            disabledScripts
        }

        const {
            chameleonExperiments
        } = requestMetadata

        const ConditionalInteractiveComponents = isPartiallyHydrated ?
            HydratedInteractiveComponents :
            InteractiveComponents

        const ConditionalDevUtils = isPartiallyHydrated ? HydratedDevUtils : DevUtils

        const processTitle = title => (toptalizeTitles ? toptalize(title) : title)

        return ( <
                > {!isBrowser() && < FontAssetsPreloader / >
                } {
                    !isBrowser() && ( <
                            Helmet >
                            <
                            title > {
                                processTitle(seo.htmlTitle)
                            } < /title> <
                            meta name = "viewport"
                            content = "width=device-width, initial-scale=1" / >
                            <
                            meta name = "theme-color"
                            content = "#204ECF" / > {
                                seo.noIndex && < meta name = "robots"
                                content = "noindex" / >
                            } <
                            meta name = "description"
                            content = {
                                seo.htmlDescription
                            }
                            /> <
                            meta property = "og:title"
                            content = {
                                processTitle(seo.ogTitle)
                            }
                            /> <
                            meta property = "og:description"
                            content = {
                                seo.ogDescription
                            }
                            /> {
                                seo.ogType && < meta property = "og:type"
                                content = {
                                    seo.ogType
                                }
                                />} {
                                    seo.ogImageUrl && ( <
                                        meta property = "og:image"
                                        content = {
                                            seo.ogImageUrl
                                        }
                                        />
                                    )
                                } {
                                    publicUrl && < meta property = "og:url"
                                    content = {
                                        publicUrl
                                    }
                                    />} <
                                    meta name = "twitter:site"
                                    content = "@toptal" / >
                                        <
                                        meta name = "twitter:card"
                                    content = "summary_large_image" / > {
                                            publicUrl && < link rel = "canonical"
                                            href = {
                                                publicUrl
                                            }
                                            />} {
                                                className && < body className = {
                                                    className
                                                }
                                                />} <
                                                /Helmet>
                                            )
                                        } {
                                            !disabledScripts[ExternalScripts.Optimizely] && ( <
                                                >
                                                <
                                                OptimizelyEdge { ...requestMetadata.vendorScriptsSettings.optimizelySettings
                                                }
                                                /> <
                                                OptimizelyWeb webEnabled = {
                                                    requestMetadata.vendorScriptsSettings.optimizelySettings
                                                    .webEnabled
                                                }
                                                webProjectId = {
                                                    requestMetadata.vendorScriptsSettings.optimizelySettings
                                                    .webProjectId
                                                }
                                                /> <
                                                />
                                            )
                                        }

                                        <
                                        Favicon / >
                                        <
                                        RelPreconnector { ...requestMetadata.vendorScriptsSettings
                                        }
                                    /> {
                                        process.env.hasOwnProperty('frontier_dev-utils') && ( <
                                            ConditionalDevUtils key = "devutils" / >
                                        )
                                    } <
                                    CookieBanner.Host / >

                                        <
                                        PageContext.Provider value = {
                                            {
                                                chameleonExperiments
                                            }
                                        } > {
                                            children
                                        } <
                                        /PageContext.Provider>

                                        <
                                        ModalHost / > {!!isSidebarEnabled && < SidebarHost / >
                                        } <
                                        ConditionalInteractiveComponents { ...interactiveComponentsProps
                                        }
                                    /> <
                                    />
                                )
                            }

                            PageTemplate.propTypes = {
                                children: PropTypes.oneOfType([
                                    PropTypes.arrayOf(PropTypes.node),
                                    PropTypes.node
                                ]).isRequired,
                                page: PropTypes.shape({
                                    bounceModals: PropTypes.object,
                                    vertical: PropTypes.shape({
                                        name: PropTypes.string,
                                        title: PropTypes.string
                                    }),
                                    seo: PropTypes.shape({
                                        htmlTitle: PropTypes.string.isRequired,
                                        htmlDescription: PropTypes.string.isRequired,
                                        ogTitle: PropTypes.string.isRequired,
                                        ogDescription: PropTypes.string.isRequired,
                                        ogImageUrl: PropTypes.string
                                    }).isRequired,
                                    slug: PropTypes.string,
                                    publicUrl: PropTypes.string
                                }),
                                requestMetadata: PropTypes.shape({
                                    geoTargetUrl: PropTypes.string,
                                    platformSessionUrl: PropTypes.string.isRequired,
                                    platformReferrersUrl: PropTypes.string.isRequired,
                                    vendorScriptsSettings: PropTypes.object.isRequired,
                                    chameleonExperiments: ExperimentsPropTypes,
                                    fullRequestUrl: PropTypes.string
                                }).isRequired,
                                isPartiallyHydrated: PropTypes.bool,
                                isSidebarEnabled: PropTypes.bool,
                                showCookieBanner: PropTypes.bool,
                                toptalizeTitles: PropTypes.bool,
                                trackScrollDepth: PropTypes.shape({
                                    gaCategory: PropTypes.string.isRequired,
                                    gaEvent: PropTypes.string
                                }),
                                className: PropTypes.string
                            }

                            export default PageTemplate