import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import('./lazyIndex'));

export { default as AccessIssue, AccessIssues } from './schema/AccessIssue';
export { default as getInfoBarViewState } from './utils/getInfoBarViewState';
export { AttachmentPolicyInfoBarId } from './schema/AttachmentPolicyInfoBarId';
export { getAccessIssues } from './utils/getAccessIssues';
export { getInfoBarId } from './utils/getInfoBarId';
export { default as getCombinedAccessIssue } from './utils/getCombinedAccessIssue';
export { default as getAttachmentPolicyBasedOnFlag } from './utils/getAttachmentPolicyBasedOnFlag';
export const lazyGetAccessIssuesForAttachments = new LazyImport(
    lazyModule,
    m => m.getAccessIssuesForAttachments
);
