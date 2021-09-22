export enum ReplyWithEndpointType {
    Contextual = 0,
    MRUCloudy = 1,
    MRUClassic = 2,
    MRUContextual = 3,
    MRUClassicContextual = 4,
}

export interface ReplyWithAttachmentSuggestion {
    DateAccessed: string;
    DateModified: string;
    Endpoint: ReplyWithEndpointType;
    FileExtension: string;
    FileName: string;
    FileSize: string;
    FileSourceType: string;
    Id: string;
    ReferenceId: string;
    SourceTitle: string;
    Url: string;
    Position?: number;
    TraceId: string | null;
    BreadcrumbLocation?: string;
    Tooltip?: string;
}
