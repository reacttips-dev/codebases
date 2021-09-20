export const ExternalScripts = {
    AppInfo: 'app-info',
    Optimizely: 'optimizely',
    Facebook: 'facebook',
    Hubspot: 'hubspot',
    Sentry: 'sentry',
    GTM: 'gtm',
    GA: 'ga',
    G2: 'g2'
}

const EXTERNAL_SCRIPTS_PARAM = 'disable-external-scripts'
const EXTERNAL_SCRIPTS_ALL = 'all'

/**
 * Returns an object map of all third party scripts with active/inactive boolean mark
 */
export const getDisabledExternalScripts = ({
    chameleonExperiments
}) => {
    const experiment = chameleonExperiments.find(
        e => e.name === EXTERNAL_SCRIPTS_PARAM
    )

    if (!experiment) {
        return {}
    }

    const disabledScripts = {}

    const scriptsFromParams = experiment.variant.split(',')
    const disableAll = scriptsFromParams.includes(EXTERNAL_SCRIPTS_ALL)

    Object.values(ExternalScripts).forEach(scriptName => {
        // ?experiments[disable-external-scripts]=all - disables all scripts
        // ?experiments[disable-external-scripts]=facebook,hubspot - disables facebook and hubspot
        // ?experiments[disable-external-scripts]=all,facebook,ga - disables all but facebook and Google analytics
        const isListed = scriptsFromParams.includes(scriptName)
        const disabled = disableAll ? !isListed : isListed

        disabledScripts[scriptName] = disabled
    })

    return disabledScripts
}