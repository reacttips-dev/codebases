import {
    gdprMinorDialogTitleText,
    gdprMinorDialogOKButtonText,
} from './showGDPRMinorDialog.locstring.json';
import { gdprMinorWarningText, gdprMinorRemoveAddinText } from '../../strings.locstring.json';
import loc from 'owa-localize';
import { default as openInClientStore } from '../../actions/openInClientStore';

import { confirm, DialogResponse } from 'owa-confirm-dialog';
import { logUsage } from 'owa-analytics';

export default async function showGDPRMinorDialog() {
    const result = await confirm(
        loc(gdprMinorDialogTitleText),
        loc(gdprMinorWarningText),
        false /* resolveImmediately */,
        {
            okText: loc(gdprMinorDialogOKButtonText),
            cancelText: loc(gdprMinorRemoveAddinText),
        }
    );

    logUsage('ExtGDPRMinorDialogResponse', [result]);
    if (result === DialogResponse.cancel) {
        openInClientStore();
    }
}
