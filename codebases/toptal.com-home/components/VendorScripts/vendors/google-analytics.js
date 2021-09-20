import {
    getCLS,
    getFID,
    getLCP
} from 'web-vitals'

import isStorybook from '~/lib/is-storybook'
import loadScript from '~/lib/load-script'
import logger from '~/lib/logger'
import fetchPageInfo from '~/lib/fetch-page-info'
import exposeCallbacks from '~/lib/expose-callbacks'
import {
    getTrackingAllowed
} from '~/lib/privacy-cookies'

import setReferrerCookie from './google-analytics/set_referrer_cookie'
import fetchCurrentRole from './utils/fetch-current-role'

const handleError = callback => error => {
    if (!(error instanceof URIError)) {
        callback(error)
    }
}

function buildConfigObject(
    anonymizeIp,
    group,
    chameleonExperiments,
    codeVersions
) {
    return Object.assign(
        basicConfig(anonymizeIp, group),
        buildChameleonExperimentsConfig(chameleonExperiments),
        buildAudienceConfig(),
        buildReleaseConfig(codeVersions)
    )
}

function basicConfig(anonymizeIp, group) {
    return {
        anonymize_ip: anonymizeIp,
        content_group1: group,
        site_speed_sample_rate: 25,
        linker: ['www.toptal.com', 'staging.toptal.net'],
        custom_map: {
            dimension10: 'client_id'
        }
    }
}

const buildChameleonExperimentsConfig = chameleonExperiments => {
    return chameleonExperiments
        .filter(experiment => experiment.googleAnalyticsDimension)
        .reduce((acc, {
            googleAnalyticsDimension,
            variant
        }) => {
            return Object.assign(acc, {
                [googleAnalyticsDimension]: variant
            })
        }, {})
}

function buildAudienceConfig() {
    const urlParams = new URLSearchParams(window.location.search)
    const dimension9 = urlParams.get('utm_audience')

    return { ...(dimension9 && {
            dimension9
        })
    }
}

function buildReleaseConfig({
    blackfish,
    frontier
}) {
    return {
        dimension22: blackfish,
        dimension23: frontier
    }
}

let GAInstance
export class GoogleAnalytics {
    constructor({
        applicationId,
        group,
        chameleonExperiments = [],
        platformSessionUrl = '',
        platformReferrersUrl = '',
        codeVersions = {}
    }) {
        this.trackingId = applicationId
        this.platformSessionUrl = platformSessionUrl
        this.platformReferrersUrl = platformReferrersUrl
        this.trackingAllowed = false
        this.group = group
        this.chameleonExperiments = chameleonExperiments
        this.codeVersions = codeVersions

        this.sendToGoogleAnalytics = this.sendToGoogleAnalytics.bind(this)

        if (!this.enabled) {
            return
        }

        /**
         *  The setup is a bit complex due to several requirements.
         *  1) As any GA setup, first we need to init empty data layer,
         *     so events can be collected even before the library is loaded.
         *     GA vendor code is responsible for utilising those events.
         */
        this.bootstrapGtag()

        /**
         * 2) We have internal dependencies, required for setting up.
         *    For instance, we need to load the GA script itself,
         *    load page info containing user's consent to use cookies
         *    and the current user data.
         */
        this.scriptPromise = loadScript(
            `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`
        )

        this.pageInfoPromise = fetchPageInfo().catch(() => {
            /* noop as the error is already logged by `fetchPageInfo` */
        })
        this.currentRolePromise = new Promise(resolve =>
            fetchCurrentRole(this.platformSessionUrl, role => resolve(role))
        )

        /*
         * 3) Wait for data from action 2 to be loaded.
         */
        this.waitForReadyState()
            .then(([, pageInfo]) => {
                this.trackingAllowed = isStorybook() ?
                    true :
                    getTrackingAllowed(pageInfo.cookiePolicyType)

                /**
                 * 4) Finally configure the `gtag` with the data arrived.
                 */
                this.configureGtag()

                const callbacks = exposeCallbacks('_runWhenGoogleAnalyticsReady')
                callbacks.trigger()
            })
            .catch(
                handleError(error => {
                    logger.error('Google Analytics failed to load', {
                        error
                    })
                })
            )
    }

    bootstrapGtag() {
        window.dataLayer = window.dataLayer || []
        window.gtag =
            window.gtag ||
            function() {
                dataLayer.push(arguments)
            }
    }

    configureGtag() {
        const config = buildConfigObject(!this.trackingAllowed,
            this.group,
            this.chameleonExperiments,
            this.codeVersions
        )

        window.gtag('js', new Date())
        window.gtag('config', this.trackingId, config)
    }

    waitForReadyState() {
        const promises = [this.scriptPromise]

        if (!isStorybook()) {
            promises.push(this.pageInfoPromise, this.currentRolePromise)
        }

        return Promise.all(promises)
    }

    get enabled() {
        return this.trackingId != null && this.trackingId.trim()
    }

    async _sendEvent(...args) {
        if (!this.enabled) {
            return
        }

        try {
            await this.waitForReadyState()
            window.gtag('event', ...args)
        } catch (error) {
            handleError(error => {
                throw error
            })(error)
        }
    }

    async bucketRole() {
        try {
            const [, , role] = await this.waitForReadyState()
            if (role ? .role_type && role ? .role_id) {
                gtag('config', this.trackingId, {
                    send_page_view: false,
                    dimension11: `${role.role_type}-${role.role_id}`
                })
            }
        } catch (error) {
            handleError(error => {
                throw error
            })(error)
        }
    }

    track15secondsRead() {
        if (!this.track15secondsReadPromise) {
            this.track15secondsReadPromise = new Promise(resolve => {
                setTimeout(() => {
                    this._sendEvent('read', {
                        event_category: '15_seconds'
                    }).then(
                        resolve
                    )
                }, GoogleAnalytics.readTimeout)
            })
        }

        return this.track15secondsReadPromise
    }

    sendToGoogleAnalytics({
        name,
        delta,
        id
    }) {
        return this._sendEvent(name, {
            event_category: 'web_vitals',
            event_label: id,
            value: Math.round(name === 'CLS' ? delta * 1000 : delta),
            non_interaction: true
        })
    }

    trackCoreWebVitals() {
        getCLS(this.sendToGoogleAnalytics)
        getFID(this.sendToGoogleAnalytics)
        getLCP(this.sendToGoogleAnalytics)
    }

    // this happens when user lands on page with referral hashtag
    trackReferrerSlug() {
        return setReferrerCookie(this.platformReferrersUrl).then(label => {
            if (!label) {
                return
            }

            return this._sendEvent('landed', {
                event_category: 'referral_slug',
                event_label: label
            })
        })
    }

    // when a bounce modal shows up.
    trackBounceModalView(type) {
        return this._sendEvent(`${type}_bounce_modal_view`, {
            event_category: 'bounce_modal',
            non_interaction: true
        })
    }

    trackBlogSubscription(label) {
        return this._sendEvent('subscribe', {
            event_category: 'blog',
            event_label: label
        })
    }

    // core team job succesfuly submitted
    trackCoreTeamJobApplicationFormApplied(jobTitle) {
        return this._sendEvent('submitted_application', {
            event_category: 'core_team_applications',
            event_label: jobTitle
        })
    }

    trackDynamicQuiz(category, action, label, value) {
        return this._sendEvent(action, {
            event_category: category,
            ...(label && {
                event_label: label
            }),
            ...(typeof value === 'number' && {
                value
            })
        })
    }

    trackHashHiringGuide(action, label) {
        return this._sendEvent(action, {
            event_category: 'hash_hiring_guide',
            event_label: label
        })
    }

    trackEvent({
        eventCategory,
        eventAction,
        eventLabel,
        ...rest
    }) {
        return this._sendEvent(eventAction, {
            event_category: eventCategory,
            event_label: eventLabel,
            ...rest
        })
    }

    trackRemoteMaturityAssessment(eventAction, eventLabel) {
        return this._sendEvent(eventAction, {
            event_category: 'remote_maturity_assessment',
            event_label: eventLabel
        })
    }

    /**
     * Remote maturity assessment quiz started
     * @param {String} eventLabel
     */
    trackRemoteReadinessQuizStarted(eventLabel) {
        return this.trackRemoteMaturityAssessment('redirected_to_quiz', eventLabel)
    }

    trackSocialButtonClicked(eventLabel, eventCategory = 'social_networks') {
        return this._sendEvent('share', {
            event_category: eventCategory,
            event_label: eventLabel
        })
    }
}

GoogleAnalytics.readTimeout = 15000

/**
 * Build and cache the instance.
 * Triggers initial set of events required for every page view.
 */
export function buildGAInstance({
    applicationId,
    group,
    chameleonExperiments,
    platformSessionUrl,
    platformReferrersUrl,
    codeVersions
}) {
    if (!GAInstance) {
        GAInstance = new GoogleAnalytics({
            applicationId,
            group,
            chameleonExperiments,
            platformSessionUrl,
            platformReferrersUrl,
            codeVersions
        })

        GAInstance.bucketRole()
        GAInstance.trackReferrerSlug()
        GAInstance.track15secondsRead()
        GAInstance.trackCoreWebVitals()
    }
    return GAInstance
}

/**
 * Get the cached instance (if exists).
 */
export default function getGAInstance() {
    return GAInstance
}

/**
 * Check if GAInstance exists and track event if it does
 * @param {string} eventCategory
 * @param {string} eventAction
 * @param {string} eventLabel
 * @param {object} options other tracking params
 */
export function trackGAEvent(
    eventCategory,
    eventAction,
    eventLabel,
    options = {}
) {
    if (getGAInstance()) {
        getGAInstance().trackEvent({
            eventCategory,
            eventAction,
            eventLabel,
            ...options
        })
    }
}

/**
 * Helps to prevent GA tracking of a container element when clicking on a tracked child
 * @param {MouseEvent} event
 */
export const stopGAPropagation = event => {
    event.nativeEvent.shouldStopGAPropagation = true
}