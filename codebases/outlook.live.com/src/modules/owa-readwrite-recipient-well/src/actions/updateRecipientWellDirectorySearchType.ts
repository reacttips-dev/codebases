import { action } from 'satcheljs/lib/legacy';
import FindControlViewState, {
    DirectorySearchType,
} from 'owa-recipient-types/lib/types/FindControlViewState';

export const updateRecipientWellDirectorySearchType = action(
    'updateRecipientWellDirectorySearchType'
)(
    (
        recipientWell: FindControlViewState,
        directorySearchType: DirectorySearchType,
        resetFindResultSet: boolean = false
    ) => {
        recipientWell.directorySearchType = directorySearchType;
        if (resetFindResultSet) {
            recipientWell.findResultSet = [];
        }
    }
);
