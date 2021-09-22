import { lazyEvaluateSafeLink } from 'owa-safelinks-evaluator';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

export default async function getCloudyAttachmentOriginalUrl(
    attachment: ReferenceAttachment
): Promise<string> {
    let safeLinkEvaluateResult: string;
    let evaluateSafeLink: (safeLinkUrl: string) => Promise<string>;
    if (!!(evaluateSafeLink = await lazyEvaluateSafeLink.import())) {
        safeLinkEvaluateResult = await evaluateSafeLink(attachment.AttachLongPathName);
    }
    return safeLinkEvaluateResult;
}
