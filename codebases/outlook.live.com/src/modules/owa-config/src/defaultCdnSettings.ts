import type { CdnSettings } from './types/CdnSettings';
import { getVariantEnvironment, findMetatag } from 'owa-metatags';
import { getQueryStringParameter, isGulpOrBranchingValue, isGulpingValue } from 'owa-querystring';

// this function is used outside of client-web
let defaultCdnContainer = 'owamail/';
export function setCdnContainer(container: string) {
    defaultCdnContainer = container;
}

let cdnSettings: CdnSettings;
export function getDefaultCdnSettings(): CdnSettings {
    if (!cdnSettings) {
        const useBackup = getQueryStringParameter('bO') == '2';
        const cdnBaseUrl = getDefaultCdnUrl();
        let primaryCdnUrl = cdnBaseUrl + defaultCdnContainer;
        let backupUrl = getDefaultCdnUrl(true) + defaultCdnContainer;
        const baseMeta = findMetatag('baseUrl');
        if (isGulpOrBranchingValue && baseMeta) {
            primaryCdnUrl = backupUrl = baseMeta;
        }
        cdnSettings = {
            PackageBaseUrl: useBackup ? backupUrl : primaryCdnUrl,
            ExtraSettings: {},
            BackupBaseUrl: useBackup ? primaryCdnUrl : backupUrl,
            ResourcesPath: '',
            ScriptPath: isGulpingValue ? '' : 'scripts/',
        };
    }
    return cdnSettings;
}

export function getDefaultCdnUrl(isBackup?: boolean): string {
    const variantEnv = getVariantEnvironment();
    switch (variantEnv) {
        case 'AG08':
            return '//cdn.blob.core.eaglex.ic.gov/';
        case 'AG09':
            return '//cdn.blob.core.microsoft.scloud/';
        default: {
            const cdnNumber = isBackup ? 2 : 1;
            let isProdBuild = true;
            const scriptVer = findMetatag('scriptVer');
            if (scriptVer && scriptVer.indexOf('.') === -1) {
                isProdBuild = false;
            }
            const cdnWWName = isProdBuild ? `res-${cdnNumber}` : `res-${cdnNumber}-sdf`;
            return variantEnv == 'Gallatin'
                ? `//outlook-${cdnNumber}.cdn.partner.outlook.cn/`
                : `//${cdnWWName}.cdn.office.net/`;
        }
    }
}
