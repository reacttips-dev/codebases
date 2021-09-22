import shouldAutoAddSignature from './shouldAutoAddSignature';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import {
    PostOpenTask,
    PostOpenTaskType,
    PostOpenTaskBase,
    getStore,
    MailComposePostOpenInitProps,
} from 'owa-mail-compose-store';

export default function createPostOpenTasks(props: MailComposePostOpenInitProps): PostOpenTask[] {
    const {
        existingInlineComposeId,
        attachments,
        attachmentFilesToUpload,
        unsupportedSmimeAttachmentNames,
        saveAndUpgrade,
        shouldLoadItemLabel,
        sendAfterOpen,
        bypassClientSideValidation,
        smimeQuotedBody,
        operation,
        forceInsertSignatureOperation,
    } = props || {};

    const primaryComposeId = getStore().primaryComposeId;

    const tasks = [
        (existingInlineComposeId || primaryComposeId) &&
            createPostOpenTask(PostOpenTaskType.CloseConflictCompose, {
                originalPrimaryComposeId: primaryComposeId,
                originalInlineComposeId: existingInlineComposeId,
            }),
        createPostOpenTask(PostOpenTaskType.Preload, {}, true /*resetInNewDeeplink*/),
        shouldAutoAddSignature(
            forceInsertSignatureOperation === undefined ? operation : forceInsertSignatureOperation
        ) &&
            createPostOpenTask(PostOpenTaskType.InsertSignature, {
                forceInsertSignatureOperation,
            }),
        (attachments || attachmentFilesToUpload) &&
            createPostOpenTask(PostOpenTaskType.InitAttachments, {
                attachments,
                attachmentFilesToUpload,
            }),
        (saveAndUpgrade || smimeQuotedBody) &&
            createPostOpenTask(PostOpenTaskType.SaveAndUpgrade, {
                ...saveAndUpgrade,
                smimeQuotedBody,
            }),
        createPostOpenTask(PostOpenTaskType.LoadComplianceConfig, {}, true /*resetInNewDeeplink*/),
        shouldLoadItemLabel && createPostOpenTask(PostOpenTaskType.LoadItemLabel),
        shouldLoadItemLabel && createPostOpenTask(PostOpenTaskType.ResolveCLPSmimeConflict),
        createPostOpenTask(
            PostOpenTaskType.AddInfoBar,
            {
                unsupportedSmimeAttachmentNames,
            },
            true /*resetInNewDeeplink*/
        ),
        sendAfterOpen && createPostOpenTask(PostOpenTaskType.Send, { bypassClientSideValidation }),
        isHostAppFeatureEnabled('opxComponentLifecycle') &&
            createPostOpenTask(PostOpenTaskType.OpxNotifyReady),
    ].filter(x => !!x);

    return tasks;
}

export type PostOpenTaskFromType<
    Task extends PostOpenTask,
    Type extends PostOpenTaskType
> = Task extends PostOpenTaskBase<Type> ? Task : never;

export type PostOpenTaskData<
    Task extends PostOpenTask,
    Type extends PostOpenTaskType
> = Task extends PostOpenTaskBase<Type>
    ? Pick<Task, Exclude<keyof Task, 'type' | 'executed'>>
    : never;

type PostOpenTaskNoParamType<
    Type extends PostOpenTaskType
> = PostOpenTaskBase<Type> extends PostOpenTaskFromType<PostOpenTask, Type> ? Type : never;

/**
 * Create PostOpenTask for the PostOpenTaskType who doesn't require additional data
 */
export function createPostOpenTask<T extends PostOpenTaskType>(
    type: PostOpenTaskNoParamType<T>
): PostOpenTaskFromType<PostOpenTask, T>;

/**
 * Create PostOpenTask for the PostOpenTaskType who requires additional data
 */
export function createPostOpenTask<T extends PostOpenTaskType>(
    type: T,
    data: PostOpenTaskData<PostOpenTask, T>,
    resetInNewDeeplink?: boolean
): PostOpenTaskFromType<PostOpenTask, T>;

export function createPostOpenTask<T extends PostOpenTaskType>(
    type: T,
    data?: PostOpenTaskData<PostOpenTask, T>,
    resetInNewDeeplink?: boolean
): PostOpenTaskFromType<PostOpenTask, T> {
    return {
        type,
        executed: false,
        resetInNewDeeplink,
        ...(data || {}),
    } as PostOpenTaskFromType<PostOpenTask, T>;
}
