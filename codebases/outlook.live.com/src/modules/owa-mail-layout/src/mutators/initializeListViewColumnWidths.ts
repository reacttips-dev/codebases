import { getStore } from '../store/Store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { mutatorAction } from 'satcheljs';

const initializeListViewColumnWidths = mutatorAction('initializeListViewColumnWidths', () => {
    const {
        senderColumnWidth,
        subjectColumnWidth,
        receivedColumnWidth,
    } = getListViewColumnWidthSettings();

    getStore().senderColumnWidth = senderColumnWidth;
    getStore().subjectColumnWidth = subjectColumnWidth;
    getStore().receivedColumnWidth = receivedColumnWidth;
});

/**
 * This function gets the default LV column width header values to render with
 * at boot. The value will either be from OWS' settings or the default values (in
 * the case where the user hasn't modified the column widths yet).
 *
 * Note that we're getting these values from the UserConfiguration object instead
 * of from the "owa-outlook-service-options" package for boot bundle size health.
 */
const getListViewColumnWidthSettings = () => {
    const primeSettingsItems = getUserConfiguration()?.PrimeSettings?.Items;
    const primeListViewColumnHeadersOptions: any[] | undefined = primeSettingsItems?.filter(
        item => item?.Id == 'ListViewColumnHeadersOptions'
    );
    const listViewColumnHeadersWidths = primeListViewColumnHeadersOptions?.[0]?.Value?.options?.[0];

    return {
        senderColumnWidth: listViewColumnHeadersWidths?.senderColumnWidth || 332,
        subjectColumnWidth: listViewColumnHeadersWidths?.subjectColumnWidth || 1000,
        receivedColumnWidth: listViewColumnHeadersWidths?.receivedColumnWidth || 80,
    };
};

export default initializeListViewColumnWidths;
