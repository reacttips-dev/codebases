import type { PreviewPaneMode, PreviewPaneViewStateBase } from './PreviewPaneViewState';

interface PdfJsPreviewState extends PreviewPaneViewStateBase {
    mode: PreviewPaneMode.PdfJs;
    previewUrl: string;
    data: Uint8Array;
    printDisabled: boolean;
    copyAllowed: boolean;
    exportAllowed: boolean;
    passwordStatus?: PdfJsPasswordState;
}

export enum PdfJsPasswordState {
    Default = 0,
    NeedPassword = 1,
    IncorrectPassword = 2,
}

export default PdfJsPreviewState;
