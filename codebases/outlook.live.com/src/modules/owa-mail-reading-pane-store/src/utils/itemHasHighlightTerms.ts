import getDisplayedMessageBody from '../utils/getDisplayedMessageBody';
import type Item from 'owa-service/lib/contract/Item';
import { getSelectedTableView } from 'owa-mail-list-store';

/**
 * Returns true if the body of an email contains one or more highlight terms from tableView
 * @param item Mail item
 * @returns a boolean - true if one or more keywords exist in the body of the item
 *  */
export default function itemHasHighlightTerms(item: Item): boolean {
    const tableView = getSelectedTableView();
    if (tableView?.highlightTerms) {
        const body = getDisplayedMessageBody(item.RightsManagementLicenseData, item.UniqueBody);
        const messsageElement = document.createElement('div');
        // Data is the body of a message item and has already been sanitized
        // tslint:disable-next-line:no-inner-html
        messsageElement.innerHTML = body;
        const hasMatch = tableView.highlightTerms.some(function (term: string) {
            return messsageElement.innerText.toLowerCase().indexOf(term) >= 0;
        });

        return hasMatch;
    }

    return false;
}
