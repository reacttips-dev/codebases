import { DatapointStatus } from 'owa-analytics';

//All search message extension modules.
export const enum LogModules {
    SearchFlyout = 'SearchFlyout' /*owa-message-extension-search-flyout*/,
    CardRendering = 'CardRendering' /*owa-message-extension-cards*/,
    MessageExtensionService = 'MessageExtensionService' /*owa-message-extension-service*/,
    CardTransformer = 'CardTransformer' /*owa-message-extension-card-transformer*/,
    MessageExtensionApps = 'MessageExtensionApps' /*owa-message-extension-apps*/,
    Analytics = 'Analytics' /*owa-message-extension-analytics*/,
    MessageExtensionConfig = 'MessageExtensionConfig' /*owa-message-extension-config*/,
    AppSideloading = 'AppSideloading' /*owa-message-extension-app-side-loading*/,
    MetaOSHubSdk = 'MetaOSHubSdk' /*MetaOSHubSdk*/,
}

export const enum LogLevel {
    Info = 'Info',
    Warning = 'Warning',
    Error = 'Error',
}

export enum Status {
    ServerError = DatapointStatus.ServerError,
    ClientError = DatapointStatus.ClientError,
    Timeout = DatapointStatus.Timeout,
}
