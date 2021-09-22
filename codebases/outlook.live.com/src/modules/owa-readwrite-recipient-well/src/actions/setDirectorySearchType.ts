import type {
    default as FindControlViewState,
    DirectorySearchType,
} from 'owa-recipient-types/lib/types/FindControlViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('setDirectorySearchType')(function setDirectorySearchType(
    viewstate: FindControlViewState,
    directorySearchType: DirectorySearchType
) {
    viewstate.directorySearchType = directorySearchType;
});
