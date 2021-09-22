import setReferrerMeta from './setReferrerMeta';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import { fetchData } from './fetchData';
import { getBrowserHeight } from 'owa-config';
import { markFunction, addBottleneck } from 'owa-performance';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import { updateDiagnosticsOnSessionData } from './sessionDiagnostics';
import { getItem, setItem, removeItem } from 'owa-local-storage';
import type { HeadersWithoutIterator } from 'owa-service/lib/RequestOptions';
import { addSessionDataHeaders } from 'owa-serviceworker-common/lib/addSessionDataHeaders';
import {
    FindMessageParametersKey,
    getCachedReadingPanePosition,
} from 'owa-serviceworker-common/lib/getCachedReadingPanePosition';
import type StartConfig from './interfaces/StartConfig';
import { firstApp } from 'owa-config/lib/bootstrapOptions';

const FindFolderParametersKey = 'sdfp';

enum LocalStorageFunnel {
    NoLocalStorage = 0,
    LocalStorageFound = 1,
    ApiFoundParams = 2,
    ApiUsedParams = 3,
}

enum StartupDiagnostics {
    None = 0,
    FoundFolderParams = 1,
    FoundMessageParams = 2,
    UsedFolderParams = 4,
    UsedMessageParams = 8,
    JsonException = 16,
}

let findFolderTunnel: LocalStorageFunnel = LocalStorageFunnel.NoLocalStorage;
let findMessageTunnel: LocalStorageFunnel = LocalStorageFunnel.NoLocalStorage;

export default markFunction(getSessionData, 'sd');
function getSessionData(config?: StartConfig): Promise<SessionData> {
    const headers = new Headers();
    const folderParams = getItem(window, FindFolderParametersKey);
    if (folderParams) {
        headers.append('folderParams', folderParams);
        findFolderTunnel = LocalStorageFunnel.LocalStorageFound;
    }
    const messageParams = getItem(window, FindMessageParametersKey);
    if (messageParams) {
        headers.append('messageParams', messageParams);
        findMessageTunnel = LocalStorageFunnel.LocalStorageFound;
    }
    addSessionDataHeaders(
        headers,
        window.location.pathname,
        firstApp == 'Native',
        getBrowserHeight(),
        getCachedReadingPanePosition()
    );

    return fetchData(config, headers, postProcess, processHeaders);
}

function postProcess(settings: SessionData) {
    if (
        settings.owaUserConfig.SessionSettings &&
        settings.owaUserConfig.SessionSettings.WebSessionType !== WebSessionType.Business
    ) {
        setReferrerMeta('origin');
    }

    settings.folderParams &&
        setItem(window, FindFolderParametersKey, JSON.stringify(settings.folderParams));
    settings.messageParams &&
        setItem(window, FindMessageParametersKey, JSON.stringify(settings.messageParams));
    updateDiagnosticsOnSessionData(settings);

    return settings;
}

function processHeaders(headers: HeadersWithoutIterator) {
    let startupDiagnostics: StartupDiagnostics | undefined;
    if (headers) {
        const preloadHeader = headers.get('x-owa-startup-preload');
        if (preloadHeader) {
            addBottleneck('sd_pr', preloadHeader);
        }
        const diagnostics = headers.get('x-owa-startup-diag');
        if (diagnostics) {
            startupDiagnostics = parseInt(diagnostics);
        }
    }
    addLocalStorageBottleneck(
        FindFolderParametersKey,
        findFolderTunnel,
        startupDiagnostics,
        StartupDiagnostics.UsedFolderParams,
        StartupDiagnostics.FoundFolderParams
    );
    addLocalStorageBottleneck(
        FindMessageParametersKey,
        findMessageTunnel,
        startupDiagnostics,
        StartupDiagnostics.UsedMessageParams,
        StartupDiagnostics.FoundMessageParams
    );
}

function addLocalStorageBottleneck(
    bottleneck: string,
    funnel: LocalStorageFunnel,
    diagnostics: StartupDiagnostics | undefined,
    useParams: StartupDiagnostics,
    foundParams: StartupDiagnostics
) {
    if (diagnostics) {
        if ((diagnostics & useParams) != 0) {
            funnel = LocalStorageFunnel.ApiUsedParams;
        } else if ((diagnostics & foundParams) != 0) {
            funnel = LocalStorageFunnel.ApiFoundParams;
        }

        // if there was a json exception in startupdata then local storage is not valid so
        // let's delete it so we don't use it next time
        if ((diagnostics & StartupDiagnostics.JsonException) != 0) {
            removeItem(window, bottleneck);
        }
    }
    addBottleneck(bottleneck, funnel);
}
