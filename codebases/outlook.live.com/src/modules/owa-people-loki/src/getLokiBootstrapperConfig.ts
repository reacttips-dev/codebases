import { refreshAuthToken, latestAuthToken } from './auth/requestAuthTokenHandler';
import * as lokiContext from './lokiContext';
import type { BootstrapperConfig, EnvironmentType } from './models/models';
import { isFeatureEnabled } from 'owa-feature-flags';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { getVariantEnvironment } from 'owa-metatags';

export function getLokiBootstrapperConfig(): BootstrapperConfig {
    if (!lokiContext.isInitialized) {
        throw new Error('You must call initializeLoki!');
    }
    const userConfig = getUserConfiguration();

    const config: BootstrapperConfig = {
        culture: lokiContext.culture,
        region: getLokiRegion(lokiContext.useDogfood, lokiContext.isMicrosoftUser),
        clientType: lokiContext.clientType,
        clientContextType: lokiContext.clientScenario,
        clientCorrelationId: lokiContext.clientCorrelationId,
        logMessage: (logType: string, logResultType: string, message?: string) => {
            lokiContext.log(logType, logResultType, message);
        },
        getAuthToken: refreshAuthToken,
        authToken: latestAuthToken,
        complianceEnvironment: getComplianceEnvironment(),
        isConsumer: lokiContext.isConsumer,
        tenantAadObjectId: userConfig.SessionSettings.ExternalDirectoryTenantGuid,
        userAadObjectId: userConfig.SessionSettings.ExternalDirectoryUserGuid,
        userPuid: userConfig.SessionSettings.UserPuid,
        hostAppConfiguration: {
            isLivePersonaCardV2Enabled: isFeatureEnabled('lpc-isLPCV2Enabled'),
        },
    };

    return config;
}

function getComplianceEnvironment(): EnvironmentType {
    switch (getVariantEnvironment()) {
        case 'BlackForest':
            return 'Blackforest';

        case 'GccHigh':
            return 'GccHigh';

        case 'DoD':
            return 'DoD';

        case 'Gallatin':
            return 'Gallatin';

        case 'AG08':
            return 'AG08';

        case 'AG09':
            return 'AG09';

        default: {
            if (isFeatureEnabled('lpc-isInGccModerate')) {
                return 'GccModerate';
            }

            return 'Prod';
        }
    }
}

function getLokiRegion(useLokiDogfood: boolean, isMicrosoftUser: boolean) {
    if (useLokiDogfood) {
        return 'df';
    }

    if (isMicrosoftUser) {
        return 'msit';
    }

    return '';
}
