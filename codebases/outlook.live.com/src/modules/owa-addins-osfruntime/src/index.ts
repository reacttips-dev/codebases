export { getCompliantAppIdHandler } from './utils/getCompliantAppIdHandler';
export { isPrivateAddin } from './utils/isPrivateAddin';

import { getPackageBaseUrl } from 'owa-config';
import { getCurrentLanguage } from 'owa-localize';

import './osfruntime';
import osfCultureMapping from './osfCultureMapping';

OSF.getLocalizedStringsFilePath = function getOSFRuntimeStringsPath() {
    let basePath = getPackageBaseUrl() + 'resources/locale/osfruntime/';
    let language = getCurrentLanguage() || 'en';
    let osfLanguageCode = osfCultureMapping[language];
    let languageCode = osfLanguageCode || 'en-us';
    let osfruntimeStringsPath = basePath + languageCode + '/jscript/';
    return osfruntimeStringsPath;
};

// TODO: Update this function not to throw for Outlook client in DevMain
OSF.getManifestHostType = function () {};
// TODO: Update this to be true for Outlook
OSF.AppTelemetry = {
    get enableTelemetry() {
        return true;
    },
};
