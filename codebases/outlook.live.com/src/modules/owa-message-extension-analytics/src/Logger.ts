import { LogLevel, LogModules } from './enum';
import type { PropertiesType } from './types/PropertiesType';
import { logUsage } from 'owa-analytics';

const MESSAGE_EXTENSION_LOGS = 'message_extension_logs';
const MESSAGE_EXTENSION_ACTIONS = 'message_extension_actions';

/**
 * @function
 * To log Error messages
 */
export const logError = (
    logModule: LogModules,
    logMessage: string,
    appId: string,
    correlationId: string,
    properties?: PropertiesType
): void => {
    logUsage(
        MESSAGE_EXTENSION_LOGS,
        {
            LogLevel: LogLevel.Error,
            LogModule: logModule,
            LogMessage: logMessage,
            AppId: appId,
            CorrelationId: correlationId ? correlationId : '',
            ...properties,
        },
        { isCore: true }
    );
};

/**
 * @function
 * To log Warnings
 */
export const logWarning = (
    logModule: LogModules,
    logMessage: string,
    appId: string,
    correlationId: string,
    properties?: PropertiesType
): void => {
    logUsage(
        MESSAGE_EXTENSION_LOGS,
        {
            LogLevel: LogLevel.Warning,
            LogModule: logModule,
            LogMessage: logMessage,
            AppId: appId,
            CorrelationId: correlationId ? correlationId : '',
            ...properties,
        },
        { isCore: true }
    );
};

/**
 * @function
 * To log Information
 */
export const logInfo = (
    logModule: LogModules,
    logMessage: string,
    appId: string,
    correlationId: string,
    properties?: PropertiesType
): void => {
    logUsage(
        MESSAGE_EXTENSION_LOGS,
        {
            LogLevel: LogLevel.Info,
            LogModule: logModule,
            LogMessage: logMessage,
            AppId: appId,
            CorrelationId: correlationId ? correlationId : '',
            ...properties,
        },
        { isCore: true }
    );
};

/**
 * @function
 * To log user actions
 */
export const logAction = (
    logModule: LogModules,
    action: string,
    appId: string,
    correlationId: string,
    properties?: PropertiesType
): void => {
    logUsage(
        MESSAGE_EXTENSION_ACTIONS,
        {
            LogModule: logModule,
            Action: action,
            AppId: appId,
            CorrelationId: correlationId ? correlationId : '',
            ...properties,
        },
        { isCore: true }
    );
};
