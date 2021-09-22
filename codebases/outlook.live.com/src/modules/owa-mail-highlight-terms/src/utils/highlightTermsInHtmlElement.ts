import getSelectedTableView from 'owa-mail-list-store/lib/utils/getSelectedTableView';
import { highlightTermsInHtmlElement } from 'owa-highlight';

export default function (element: HTMLElement) {
    const tableView = getSelectedTableView();
    if (tableView) {
        // TableView is null when open a message from photohub
        highlightTermsInHtmlElement(
            element,
            tableView.highlightTerms,
            false /* separateWordSearch */,
            true /* matchPrefix */
        );
    }
}
