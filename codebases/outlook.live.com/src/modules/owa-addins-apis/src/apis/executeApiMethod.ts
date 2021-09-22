import ApiErrorCode from './ApiErrorCode';
import type { ApiMethodCallback } from './ApiMethod';
import { apiMethods } from './executeApiMethodInfo';
import { createErrorResult } from './ApiMethodResponseCreator';
import doesItemExist from '../utils/doesItemExist';
import { logUsage } from 'owa-analytics';
import type { OutlookMethodDispId } from './OutlookMethodDispId';
import {
    getAddinCommandForControl,
    IAddinCommand,
    getEntryPointForControl,
    getScenarioFromHostItemIndex,
    isAutoRunAddinCommand,
} from 'owa-addins-store';
import { getApp } from 'owa-config';
import { isFeatureEnabled } from 'owa-feature-flags';
import isAutorunAndApiMethodBlacklisted from '../utils/isAutorunAndApiMethodBlacklisted';
import doesAddinHaveRequiredPermission from './sharedProperties/validateAddinPermission';
import { getPerformanceNow } from 'owa-fps-jank';
import { getCompliantAppId } from 'owa-addins-analytics';

export let createErrorResultToLog; //Making it global to import it for testing in executeApiMethodTests

export default function executeApiMethod(
    hostItemIndex: string,
    dispId: OutlookMethodDispId,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
): void {
    if (!apiMethods[dispId] || !apiMethods[dispId].apiMethodDelegate) {
        return;
    }
    const method = apiMethods[dispId].apiMethodDelegate;
    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
    const name = 'ExecuteApiMethod';
    if (!doesItemExist(hostItemIndex)) {
        logUsage('ExtExecuteApiMethodNoItemFailure', [dispId]);
        callback(createErrorResult(ApiErrorCode.GenericResponseError));
        return;
    }

    if (!doesAddinHaveRequiredPermission(controlId, apiMethods[dispId].apiPermissionRequired)) {
        logUsage('ExtExecuteApiMethodInsufficientPermissions', [dispId]);
        callback(createErrorResult(ApiErrorCode.InsufficientItemPermissions));
        return;
    }

    const isApiMethodBlacklisted = isAutorunAndApiMethodBlacklisted(controlId, dispId);
    if (isFeatureEnabled('addin-autoRun') && isApiMethodBlacklisted) {
        logUsage('ExtExecuteApiMethodNotSupportedInAutorun', [dispId]);
        callback(createErrorResult(ApiErrorCode.ApiCallNotSupportedByExtensionPoint));
        return;
    }

    let apiStartTime = getPerformanceNow();
    try {
        createErrorResultToLog = response => {
            let errorCode: ApiErrorCode = null;
            if (response) {
                if (response.errorCode) {
                    errorCode = response.errorCode;
                } else if (response.Error) {
                    errorCode = response.Error;
                }
            }

            let apiEndTime = getPerformanceNow();
            logUsage(name, {
                dispId,
                Id: getCompliantAppId(addinCommand.extension),
                DisplayName: addinCommand.extension.DisplayName,
                owa_1: getApp(),
                owa_2: getScenarioFromHostItemIndex(hostItemIndex),
                extPoint: getEntryPointForControl(controlId),
                owa_4: addinCommand.extension.Type,
                apiExecutionTime: apiEndTime - apiStartTime, // in milliseconds
                isAutoRun: isAutoRunAddinCommand(addinCommand),
                errorCode,
            });
            callback(response);
        };
        method(hostItemIndex, controlId, data, createErrorResultToLog);
    } catch (error) {
        let apiEndTime = getPerformanceNow();
        logUsage(name, {
            dispId,
            Id: getCompliantAppId(addinCommand.extension),
            DisplayName: addinCommand.extension.DisplayName,
            owa_1: getApp(),
            owa_2: getScenarioFromHostItemIndex(hostItemIndex),
            extPoint: getEntryPointForControl(controlId),
            owa_4: addinCommand.extension.Type,
            apiExecutionTime: apiEndTime - apiStartTime, // in milliseconds
            isAutoRun: isAutoRunAddinCommand(addinCommand),
            error: JSON.stringify(error),
        });
        callback(createErrorResult(ApiErrorCode.InternalServerError));
    }
}
