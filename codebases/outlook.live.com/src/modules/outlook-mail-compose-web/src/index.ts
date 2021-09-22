import { createLazyResolver } from 'owa-lazy-resolver';

export const lazyCreateDraftWeb = createLazyResolver(
    'MUTATION_CREATE_DRAFT_WEB',
    () => import(/* webpackChunkName: "CreateDraftWeb"*/ './queries/createDraftWeb'),
    m => m.createDraftWeb
);

export const lazySaveDraftWeb = createLazyResolver(
    'MUTATION_SAVE_DRAFT_WEB',
    () => import(/* webpackChunkName: "SaveDraftWeb"*/ './queries/saveDraftWeb'),
    m => m.saveDraftWeb
);

export const lazySendDraftWeb = createLazyResolver(
    'MUTATION_SAVE_DRAFT_WEB',
    () => import(/* webpackChunkName: "SendDraftWeb"*/ './queries/sendDraftWeb'),
    m => m.sendDraftWeb
);

export const lazyAddAttachmentToDraftWeb = createLazyResolver(
    'MUTATION_ADD_ATTACHMENT_TO_DRAFT_WEB',
    () =>
        import(
            /* webpackChunkName: "AddAttachmentToDraftWeb"*/ './queries/addAttachmentToDraftWeb'
        ),
    m => m.addAttachmentToDraftWeb
);

export const lazySaveSmartReplyWeb = createLazyResolver(
    'MUTATION_SAVE_SMART_REPLY_WEB',
    () => import(/* webpackChunkName: "SaveSmartReplyWeb"*/ './queries/saveSmartReplyWeb'),
    m => m.saveSmartReplyWeb
);

export const lazySendSmartReplyWeb = createLazyResolver(
    'MUTATION_SAVE_DRAFT_WEB',
    () => import(/* webpackChunkName: "SendSmartReplyWeb"*/ './queries/sendSmartReplyWeb'),
    m => m.sendSmartReplyWeb
);
