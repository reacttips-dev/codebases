import type ReadingPanePosition from 'owa-session-store/lib/store/schema/ReadingPanePosition';

interface MailLayoutStore {
    clientReadingPanePosition: ReadingPanePosition | null;
    showReadingPane: boolean;
    showListPane: boolean;
    showFolderPane: boolean;

    // Column width values for SLV
    senderColumnWidth: number | null;
    subjectColumnWidth: number | null;
    receivedColumnWidth: number | null;
}

export default MailLayoutStore;

export enum ListViewLayout {
    SingleLine,
    ThreeLine,
}
