import { getStore } from '../store/store';

export default function isAttachmentRefinerApplied(): boolean {
    return getStore().includeAttachments;
}
