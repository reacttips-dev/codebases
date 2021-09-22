export enum ComposeUniqueState {
    None,
    PlainText,
    Encrypted,
    GroupCalendar,
}

interface FilePickerUploadConfiguration {
    /** name of the folder that the attachments will be uploaded to in the "upload and share" scenario.
     * This is needed when it differs from 'Email attachments' */
    folderName?: string;
    /** upload text that is shown in the actions panel  in the "upload and share" scenario.
     * This is only needed when it differs from the default upload text */
    uploadText?: string;
    /** Used to disable the "Upload and Share" scenario */
    uploadDisabled?: boolean;
    /** When the mail is set plain text or encrypted, we disable any reference attachments*/
    composeUniqueState?: ComposeUniqueState;
}

export default FilePickerUploadConfiguration;
