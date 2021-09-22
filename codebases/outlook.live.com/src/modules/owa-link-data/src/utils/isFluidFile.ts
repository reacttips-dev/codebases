import getExtensionFromFileName from 'owa-file/lib/utils/getExtensionFromFileName';
import { isFeatureEnabled } from 'owa-feature-flags';

export function isFluidFile(fileName: string): boolean {
    const extension = (getExtensionFromFileName(fileName) || '').toLowerCase();
    return !fileName
        ? false
        : isFeatureEnabled('cmp-prague') && (extension === '.fluid' || extension === '.note');
}

export function isOneNoteFluidFile(fileName: string): boolean {
    const extension = (getExtensionFromFileName(fileName) || '').toLowerCase();
    return !fileName ? false : isFeatureEnabled('cmp-prague') && extension === '.note';
}
