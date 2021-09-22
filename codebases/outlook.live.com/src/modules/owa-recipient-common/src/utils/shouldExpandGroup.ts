import {
    confirmGroupExpansionText,
    confirmGroupExpansionSubText,
    confirmGroupExpansionButtonText,
} from './shouldExpandGroup.locstring.json';
import loc from 'owa-localize';
import { confirm, DialogResponse } from 'owa-confirm-dialog';

const MAX_DL_MEMBERS_TO_EXPAND = 100;

const shouldExpandGroup = async (totalMemberCount: number): Promise<boolean> => {
    const resolveImmediately: boolean = totalMemberCount <= MAX_DL_MEMBERS_TO_EXPAND;
    const response: DialogResponse = await confirm(
        loc(confirmGroupExpansionText),
        loc(confirmGroupExpansionSubText),
        resolveImmediately,
        {
            // Wait until dialog is dismissed to avoid focus interruption
            delayCallbackAfterAnimation: true,
            okText: loc(confirmGroupExpansionButtonText),
        }
    );

    return response === DialogResponse.ok;
};

export default shouldExpandGroup;
