import React, {
    useEffect
} from 'react'
import PropTypes from 'prop-types'

import {
    ExperimentsPropTypes
} from '~/lib/prop-types'
import {
    ExternalScripts
} from '~/lib/get-disabled-external-scripts'

import ClientScript from '~/components/ClientScript'

import appInfoScript from './vendors/appinfo'
import SentryScripts from './vendors/sentry'
import HubspotScripts from './vendors/hubspot'
import FacebookScripts from './vendors/facebook'
import GoogleTagManagerScripts from './vendors/google-tag-manager'
import initializeFullstory from './vendors/fullstory'
import {
    buildGAInstance
} from './vendors/google-analytics'
import G2Scripts from './vendors/g2'
import getScriptDelay from './config/get-script-delay'

const VendorScripts = ({
        appinfoSettings,
        hubspotSettings,
        facebookSettings,
        fullstorySettings,
        googleAnalyticsSettings,
        googleTagManagerSettings,
        trackingAllowed,
        renderProductionOnlyScripts,
        chameleonExperiments,
        platformSessionUrl,
        platformReferrersUrl,
        publicUrl,
        codeVersions,
        disabledScripts
    }) => {
        const {
            group
        } = googleAnalyticsSettings
        const scriptDelay = getScriptDelay({
            publicUrl,
            group
        })

        useEffect(() => {
            if (disabledScripts[ExternalScripts.GA]) {
                return
            }

            const {
                applicationId,
                group
            } = googleAnalyticsSettings
            buildGAInstance({
                applicationId,
                group,
                chameleonExperiments,
                platformSessionUrl,
                platformReferrersUrl,
                codeVersions
            })
        }, [
            chameleonExperiments,
            googleAnalyticsSettings,
            platformReferrersUrl,
            platformSessionUrl,
            codeVersions,
            disabledScripts
        ])

        useEffect(() => {
            if (trackingAllowed && fullstorySettings && renderProductionOnlyScripts) {
                initializeFullstory({
                    platformSessionUrl,
                    chameleonExperiments,
                    ...fullstorySettings
                })
            }
        }, [
            platformSessionUrl,
            chameleonExperiments,
            fullstorySettings,
            trackingAllowed,
            renderProductionOnlyScripts
        ])

        return ( <
            > {!disabledScripts[ExternalScripts.AppInfo] && ( <
                    ClientScript body = {
                        appInfoScript(appinfoSettings)
                    }
                    />
                )
            } {
                trackingAllowed && ( <
                        > {!disabledScripts[ExternalScripts.Sentry] && < SentryScripts / >
                        } {
                            !disabledScripts[ExternalScripts.Hubspot] && ( <
                                HubspotScripts delay = {
                                    scriptDelay
                                } { ...hubspotSettings
                                }
                                />
                            )
                        } {
                            !disabledScripts[ExternalScripts.Facebook] && ( <
                                FacebookScripts delay = {
                                    scriptDelay
                                } { ...facebookSettings
                                }
                                />
                            )
                        } {
                            !disabledScripts[ExternalScripts.GTM] && ( <
                                GoogleTagManagerScripts delay = {
                                    scriptDelay
                                } { ...googleTagManagerSettings
                                }
                                />
                            )
                        } {
                            !disabledScripts[ExternalScripts.G2] && < G2Scripts group = {
                                group
                            }
                            />} <
                            />
                        )
                    } <
                    />
            )
        }

        VendorScripts.propTypes = {
            appinfoSettings: PropTypes.shape({
                baseUrl: PropTypes.string.isRequired,
                withCredentials: PropTypes.bool.isRequired,
                jsClientUrl: PropTypes.string.isRequired,
                data: PropTypes.shape({
                    lpSkill: PropTypes.string.isRequired,
                    lpSkillTitle: PropTypes.string.isRequired,
                    lpSkillRole: PropTypes.string.isRequired
                })
            }).isRequired,
            fullstorySettings: PropTypes.shape({
                rate: PropTypes.number.isRequired,
                orgKey: PropTypes.string.isRequired
            }),
            googleAnalyticsSettings: PropTypes.shape({
                applicationId: PropTypes.string,
                group: PropTypes.string.isRequired,
                anonymous: PropTypes.bool
            }),
            googleTagManagerSettings: PropTypes.shape({
                id: PropTypes.string.isRequired,
                envGetParams: PropTypes.string.isRequired
            }),
            hubspotSettings: PropTypes.shape({
                portalId: PropTypes.string.isRequired
            }),
            facebookSettings: PropTypes.shape({
                pixelId: PropTypes.string.isRequired
            }),
            trackingAllowed: PropTypes.bool.isRequired,
            renderProductionOnlyScripts: PropTypes.bool.isRequired,
            chameleonExperiments: ExperimentsPropTypes,
            platformSessionUrl: PropTypes.string.isRequired,
            platformReferrersUrl: PropTypes.string.isRequired,
            publicUrl: PropTypes.string,
            disabledScripts: PropTypes.objectOf(PropTypes.bool)
        }

        export default VendorScripts