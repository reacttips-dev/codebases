import type SonoraItem from './SonoraItem';
import type SonoraSuggestionBase from './SonoraSuggestionBase';

export enum SonoraFileSuggestionSourceType {
    Undefined = 0,
    ClassicAttachment = 1,
    OneDriveForBusiness = 2,
    SharepointOnline = 3,
}

export default interface SonoraFileSuggestion extends SonoraSuggestionBase {
    suggestions: SonoraFile[];
}

export interface SonoraFile extends SonoraItem {
    sourceType: SonoraFileSuggestionSourceType;
    fileName: string;
    hitFileName: string;
    fileExtension: string;
    fileSize: number;
    url: string;
    lastAccessDateTime: string | undefined;
    lastModifiedDateTime: string | undefined;
    createdDateTime: string | undefined;
    attachmentId: string | undefined;
    itemId: string | undefined;
    subject: string | undefined;
    relatedTopicName: string | undefined;
}
