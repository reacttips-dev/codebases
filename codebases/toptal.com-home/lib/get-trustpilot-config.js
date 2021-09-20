/**
 * @param vendorScriptsSettings
 * @param settings
 * @returns {{disableSEOSnippet: boolean, href: string, templateId: string, locale: string, businessUnitId: string}}
 */
export const getTrustpilotSettings = ({
    vendorScriptsSettings
}, settings) => {
    const {
        businessUnitId
    } = vendorScriptsSettings.trustpilotSettings

    return getTrustpilotConfig({
        businessUnitId,
        ...settings
    })
}

/**
 * @param businessUnitId
 * @param templateId
 * @param disableSEOSnippet
 * @returns {{disableSEOSnippet: boolean, href: string, templateId: string, locale: string, businessUnitId: string}}
 */
const getTrustpilotConfig = ({
    businessUnitId,
    templateId,
    disableSEOSnippet
}) => ({
    businessUnitId,
    templateId,
    locale: 'en-US',
    href: 'https://www.trustpilot.com/review/toptal.com',
    disableSEOSnippet
})

export const TRUSTPILOT_TEMPLATES = {
    SKILL_PAGE_SIDEBAR: '53aa8807dec7e10d38f59f32',
    SKILL_PAGE: '53aa8912dec7e10d38f59f36',
    HIRING_GUIDE_PAGE: '5406e65db0d04a09e042d5fc',
    HOME_PAGE: '5406e65db0d04a09e042d5fc',
    VERTICAL_LANDING_PAGE: '5406e65db0d04a09e042d5fc'
}

export default getTrustpilotConfig