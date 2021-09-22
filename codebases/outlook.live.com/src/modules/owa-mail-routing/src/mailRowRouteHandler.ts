import selectFolderAndRow from './selectFolderAndRow';
import selectRow from './selectRow';
export interface MailRowRouteParameters {
    folderId?: string;
    rowId: string;
}
export default function mailRowRouteHandler(parameters: MailRowRouteParameters) {
    selectRow(parameters.rowId);
}
export function mailRowFolderRouteHandler(parameters: MailRowRouteParameters) {
    const { folderId, rowId } = parameters;
    selectFolderAndRow(folderId, rowId);
}
