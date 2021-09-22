import selectFolderWithFallback from './selectFolderWithFallback';
export interface MailFolderRouteParameters {
    folderId: string;
}

export default function mailFolderRouteHandler(parameters: MailFolderRouteParameters) {
    selectFolderWithFallback(parameters.folderId);
}
