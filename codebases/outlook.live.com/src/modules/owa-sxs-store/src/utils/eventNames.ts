import type { LoadedInfo } from 'owa-sxsdata';

export const EnteredEditModeEvent = 'EnteredEditMode';
export const ExitedEditModeEvent = 'ExitedEditMode';
export const PreviewLoadEvent = 'PreviewLoad';
export const PreviewErrorEvent = 'PreviewError';
export const PreviewLoadOrErrorEvent = 'PreviewLoadOrError';
export const CloseEvent = 'Close';
export const AnimationEndEvent = 'AnimationEnd';
export interface LoadOrErrorEventData {
    loadedInfo?: LoadedInfo;
    errorMessage: string;
    error?: Error;
}
