// This file was automatically generated from system.schema.d.ts
// and contains types and methods for calling PIE

import * as PIEBridge from '@microsoft/pie.sharedbridge';

export function GetPIEScriptVersion(): number {
    return 0.8;
}

export enum PhysicalRingEnum {
    Unknown = 'Unknown',
    WW = 'WW',
    Dogfood = 'Dogfood',
    SIP = 'SIP',
    BlackForest = 'BlackForest',
    DONMT = 'DONMT',
    MSIT = 'MSIT',
    Gallatin = 'Gallatin',
    SDFV2 = 'SDFV2',
    PDT = 'PDT',
    TDF = 'TDF',
    ITAR = 'ITAR',
}

export enum VariantEnvironmentEnum {
    Unknown = 'Unknown',
    AG08 = 'AG08',
    AG09 = 'AG09',
    BlackForest = 'BlackForest',
    DITAR = 'DITAR',
    DoD = 'DoD',
    Dogfood = 'Dogfood',
    Gallatin = 'Gallatin',
    GCCModerate = 'GCCModerate',
    GccHigh = 'GccHigh',
    GovCloud = 'GovCloud',
    ITAR = 'ITAR',
    Prod = 'Prod',
}

export enum LogicalRingEnum {
    Dogfood = 'Dogfood',
    Microsoft = 'Microsoft',
    FirstRelease = 'FirstRelease',
    WW = 'WW',
    Unknown = 'Unknown',
}

export enum UserType {
    Business = 'Business',
    Consumer = 'Consumer',
}

export interface WindowDimensions {
    width: number;
    height: number;
}

export interface RectDimensions {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface UpdateFrameContext {
    window: WindowDimensions;
    titleBar: RectDimensions;
    excluded: RectDimensions[];
}

export interface DiagnosticInfo {
    physicalRing: PhysicalRingEnum;
    variantEnv: VariantEnvironmentEnum;
    logicalRing: LogicalRingEnum;
    userType: UserType;
    isCd: boolean;
}

export interface KeyValuePair {
    key: string;
    value: string;
}

export interface WindowState {
    isMaximized: boolean;
}

export interface CloseParams {
    windowId: string;
}

export interface ToggleMaximizeParams {
    windowId: string;
}

export interface MinimizeParams {
    windowId: string;
}

export interface BootCompletedParams {
    info?: DiagnosticInfo;
}

export interface BootFailedParams {
    telemetry?: KeyValuePair[];
}

export interface UpdateFlightsParams {
    flights: string[];
}

export interface UpdateFrameParams {
    context: UpdateFrameContext;
    windwowId?: string;
}

export interface UpdateMainWindowIconParams {
    fullIconResourcePath: string;
    overlayIconResourcePath?: string;
}

export interface PopoutLoadedParams {
    windowId: string;
}

export interface InitialWindowStateParams {
    windowState: WindowState;
}

export class JsonPostProcessing {
    public static ArrayOfRectDimensionsValue(json: any): RectDimensions[] {
        for (let index = 0; index < json.length; index++) {
            json[index] = JsonPostProcessing.RectDimensionsValue(json[index]);
        }

        return json;
    }

    public static ArrayOfKeyValuePairValue(json: any): KeyValuePair[] {
        for (let index = 0; index < json.length; index++) {
            json[index] = JsonPostProcessing.KeyValuePairValue(json[index]);
        }

        return json;
    }

    public static ArrayOfStringValue(json: any): string[] {
        return json;
    }

    public static PhysicalRingEnumValue(json: string): PhysicalRingEnum {
        return json as PhysicalRingEnum;
    }

    public static VariantEnvironmentEnumValue(json: string): VariantEnvironmentEnum {
        return json as VariantEnvironmentEnum;
    }

    public static LogicalRingEnumValue(json: string): LogicalRingEnum {
        return json as LogicalRingEnum;
    }

    public static UserTypeValue(json: string): UserType {
        return json as UserType;
    }

    public static WindowDimensionsValue(json: any): WindowDimensions {
        const value = json as WindowDimensions;
        return value;
    }

    public static RectDimensionsValue(json: any): RectDimensions {
        const value = json as RectDimensions;
        return value;
    }

    public static UpdateFrameContextValue(json: any): UpdateFrameContext {
        const value = json as UpdateFrameContext;
        value.window = JsonPostProcessing.WindowDimensionsValue(value.window);
        value.titleBar = JsonPostProcessing.RectDimensionsValue(value.titleBar);
        value.excluded = JsonPostProcessing.ArrayOfRectDimensionsValue(value.excluded);
        return value;
    }

    public static DiagnosticInfoValue(json: any): DiagnosticInfo {
        const value = json as DiagnosticInfo;
        value.physicalRing = JsonPostProcessing.PhysicalRingEnumValue(value.physicalRing);
        value.variantEnv = JsonPostProcessing.VariantEnvironmentEnumValue(value.variantEnv);
        value.logicalRing = JsonPostProcessing.LogicalRingEnumValue(value.logicalRing);
        value.userType = JsonPostProcessing.UserTypeValue(value.userType);
        return value;
    }

    public static KeyValuePairValue(json: any): KeyValuePair {
        const value = json as KeyValuePair;
        return value;
    }

    public static WindowStateValue(json: any): WindowState {
        const value = json as WindowState;
        return value;
    }

    public static CloseParamsValue(json: any): CloseParams {
        const value = json as CloseParams;
        return value;
    }

    public static ToggleMaximizeParamsValue(json: any): ToggleMaximizeParams {
        const value = json as ToggleMaximizeParams;
        return value;
    }

    public static MinimizeParamsValue(json: any): MinimizeParams {
        const value = json as MinimizeParams;
        return value;
    }

    public static BootCompletedParamsValue(json: any): BootCompletedParams {
        const value = json as BootCompletedParams;
        if (value.info !== undefined) {
            value.info = JsonPostProcessing.DiagnosticInfoValue(value.info);
        }
        return value;
    }

    public static BootFailedParamsValue(json: any): BootFailedParams {
        const value = json as BootFailedParams;
        if (value.telemetry !== undefined) {
            value.telemetry = JsonPostProcessing.ArrayOfKeyValuePairValue(value.telemetry);
        }
        return value;
    }

    public static UpdateFlightsParamsValue(json: any): UpdateFlightsParams {
        const value = json as UpdateFlightsParams;
        return value;
    }

    public static UpdateFrameParamsValue(json: any): UpdateFrameParams {
        const value = json as UpdateFrameParams;
        value.context = JsonPostProcessing.UpdateFrameContextValue(value.context);
        return value;
    }

    public static UpdateMainWindowIconParamsValue(json: any): UpdateMainWindowIconParams {
        const value = json as UpdateMainWindowIconParams;
        return value;
    }

    public static PopoutLoadedParamsValue(json: any): PopoutLoadedParams {
        const value = json as PopoutLoadedParams;
        return value;
    }

    public static InitialWindowStateParamsValue(json: any): InitialWindowStateParams {
        const value = json as InitialWindowStateParams;
        value.windowState = JsonPostProcessing.WindowStateValue(value.windowState);
        return value;
    }
}

export async function close(windowId: string): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('System', 0.4);
    const args = { windowId: windowId } as CloseParams;
    return PIEBridge.HostBridge.invokeHost('System.close', args, undefined);
}

export async function toggleMaximize(windowId: string): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('System', 0.4);
    const args = { windowId: windowId } as ToggleMaximizeParams;
    return PIEBridge.HostBridge.invokeHost('System.toggleMaximize', args, undefined);
}

export async function minimize(windowId: string): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('System', 0.4);
    const args = { windowId: windowId } as MinimizeParams;
    return PIEBridge.HostBridge.invokeHost('System.minimize', args, undefined);
}

export async function bootCompleted(info?: DiagnosticInfo): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('System', 0.3);
    const args = { info: info } as BootCompletedParams;
    return PIEBridge.HostBridge.invokeHost('System.bootCompleted', args, undefined);
}

export async function bootFailed(telemetry?: KeyValuePair[]): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('System', 0.6);
    const args = { telemetry: telemetry } as BootFailedParams;
    return PIEBridge.HostBridge.invokeHost('System.bootFailed', args, undefined);
}

export async function updateHost(): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('System', 0.1);
    return PIEBridge.HostBridge.invokeHost('System.updateHost', {}, undefined);
}

export async function updateFlights(flights: string[]): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('System', 0.7);
    const args = { flights: flights } as UpdateFlightsParams;
    return PIEBridge.HostBridge.invokeHost('System.updateFlights', args, undefined);
}

export async function updateFrame(context: UpdateFrameContext, windwowId?: string): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('System', 0.5);
    const args = { context: context, windwowId: windwowId } as UpdateFrameParams;
    return PIEBridge.HostBridge.invokeHost('System.updateFrame', args, undefined);
}

export async function updateMainWindowIcon(
    fullIconResourcePath: string,
    overlayIconResourcePath?: string
): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('System', 0.8);
    const args = {
        fullIconResourcePath: fullIconResourcePath,
        overlayIconResourcePath: overlayIconResourcePath,
    } as UpdateMainWindowIconParams;
    return PIEBridge.HostBridge.invokeHost('System.updateMainWindowIcon', args, undefined);
}

export async function popoutLoaded(windowId: string): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('System', 0.4);
    const args = { windowId: windowId } as PopoutLoadedParams;
    return PIEBridge.HostBridge.invokeHost('System.popoutLoaded', args, undefined);
}

// Registers for the specified event
export function registerForPromptUpdateHost(
    callback: () => void
): PIEBridge.DisposeEventRegistration {
    const callbackHandler: () => void = function () {
        callback();
    };

    return PIEBridge.HostBridge.registerForEvent('System.promptUpdateHost', callbackHandler);
}

// Registers for the specified event
export function registerForInitialWindowState(
    callback: (windowState: WindowState) => void
): PIEBridge.DisposeEventRegistration {
    const callbackHandler: (jsonObject: any) => void = function (jsonObject: any) {
        if (jsonObject) {
            const eventArgs: InitialWindowStateParams = JsonPostProcessing.InitialWindowStateParamsValue(
                jsonObject
            );
            callback(eventArgs.windowState);
        }
    };

    return PIEBridge.HostBridge.registerForEvent('System.initialWindowState', callbackHandler);
}
