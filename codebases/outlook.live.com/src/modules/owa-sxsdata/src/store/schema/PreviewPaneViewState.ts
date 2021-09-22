import type AudioPreviewState from './AudioPreviewState';
import type IframePreviewState from './IFramePreviewState';
import type ImagePreviewState from './ImagePreviewState';
import type NativePdfPreviewState from './NativePdfPreviewState';
import type PdfJsPreviewState from './PdfJsPreviewState';
import type TextPreviewState from './TextPreviewState';
import type VideoPreviewState from './VideoPreviewState';
import type WacPreviewState from './WacPreviewState';

export enum PreviewPaneMode {
    Blank,
    Loading,
    Error,
    Custom,
    Image,
    Wac,
    Audio,
    Video,
    Text,
    NativePdf,
    PdfJs,
    IFrame,
}

type PreviewPaneViewState =
    | AudioPreviewState
    | IframePreviewState
    | ImagePreviewState
    | NativePdfPreviewState
    | PdfJsPreviewState
    | PreviewPaneBlankViewState
    | PreviewPaneCustomViewState
    | PreviewPaneErrorViewState
    | PreviewPaneLoadingViewState
    | TextPreviewState
    | VideoPreviewState
    | WacPreviewState;

export interface PreviewPaneViewStateBase {
    downloadUrl?: string;
    downloadShouldOpenNewTab?: boolean;
    fileName?: string;
    useHighContrastCommandBar?: boolean;
    id?: any;
    isCloudy?: boolean;
    openInNewTabUrl?: string;
}

export default PreviewPaneViewState;

export interface PreviewPaneBlankViewState extends PreviewPaneViewStateBase {
    mode: PreviewPaneMode.Blank;
}

export interface PreviewPaneLoadingViewState extends PreviewPaneViewStateBase {
    mode: PreviewPaneMode.Loading;
    message: string;
}

export interface PreviewPaneErrorViewState extends PreviewPaneViewStateBase {
    mode: PreviewPaneMode.Error;
    errorMessage: string;
}

export interface PreviewPaneCustomViewState extends PreviewPaneViewStateBase {
    mode: PreviewPaneMode.Custom;
}
