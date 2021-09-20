import {
    getCookie
} from '~/lib/cookies'

import fetchCurrentRole from './utils/fetch-current-role'
import loadFullstory from './load-fullstory'

const FULLSTORY_ENABLED_KEY = 'toptal_fullstory_enabled'
const FULLSTORY_OVERRIDE_EXPERIMENT = 'phoenix_fullstory_override'

/**
 * Transforms snake case string to camel case
 * @param {string} str
 * @returns {string}
 */
const snakeToCamelCase = str => {
    return str.replace(/(_[a-z])/gi, function(match) {
        return match.replace('_', '').toUpperCase()
    })
}

/**
 * Aggregates Chameleon data for the Fullstory
 * @param {object} chameleonExperiments
 * @returns {Object}
 */
const getChameleonUserVars = chameleonExperiments => {
    var result = {
        chameleonUuid_str: getCookie('chameleon_identity')
    }

    for (let i = 0; i < chameleonExperiments.length; i++) {
        const {
            name,
            variant
        } = chameleonExperiments[i]
        result[snakeToCamelCase(name) + '_str'] = variant
    }

    return result
}

/**
 * Initiates loading Fullstory script and sets user's metadata
 *
 * @param {Object} options
 * @param {string} options.orgKey
 * @param {string} options.platformSessionUrl
 * @param {Object} options.chameleonExperiments
 */
const startCapturing = ({
    orgKey,
    platformSessionUrl,
    chameleonExperiments
}) => {
    loadFullstory(orgKey)
    fetchCurrentRole(platformSessionUrl, role => {
        const chameleonVars = getChameleonUserVars(chameleonExperiments)
        if (role) {
            window.FS.identify(role.role_id, {
                displayName: role.full_name,
                email: role.email,
                role: role.role_type,
                ...chameleonVars
            })
        } else {
            window.FS.setUserVars(chameleonVars)
        }
    })
}

/**
 * Returns parsed flag from the localStorage
 * @returns {boolean}
 */
const getCurrentEnabledState = () =>
    JSON.parse(localStorage.getItem(FULLSTORY_ENABLED_KEY))

/**
 * Checks if Fullstory should be enabled for a user and initializes capturing
 *
 * @param {Object} options
 * @param {string} options.orgKey
 * @param {number} options.rate
 * @param {string} options.platformSessionUrl
 * @param {Object} options.chameleonExperiments
 */
export default ({
    orgKey,
    rate,
    platformSessionUrl,
    chameleonExperiments
}) => {
    const [fullstoryOverrideExperiment] = chameleonExperiments.filter(
        ({
            name
        }) => name === FULLSTORY_OVERRIDE_EXPERIMENT
    )

    if (fullstoryOverrideExperiment) {
        if (fullstoryOverrideExperiment.variant === 'enabled') {
            startCapturing({
                orgKey,
                platformSessionUrl,
                chameleonExperiments
            })
        }
    }

    if (getCurrentEnabledState() == null) {
        const isInBucket = Math.random() <= rate
        localStorage.setItem(FULLSTORY_ENABLED_KEY, isInBucket.toString())
    }

    if (getCurrentEnabledState()) {
        startCapturing({
            orgKey,
            platformSessionUrl,
            chameleonExperiments
        })
    }
}