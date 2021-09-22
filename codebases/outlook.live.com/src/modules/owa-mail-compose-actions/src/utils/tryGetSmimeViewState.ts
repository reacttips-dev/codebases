import isSmimeSupportedInCompose from './isSmimeSupportedInCompose';
import { ComposeOperation } from 'owa-mail-compose-store';
import type ClientItem from 'owa-mail-store/lib/store/schema/ClientItem';
import type Item from 'owa-service/lib/contract/Item';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { lazyGetMergedSmimeViewState, lazyGetMergedSmimeViewStateForDraft } from 'owa-smime';
import type SmimeType from 'owa-smime-adapter/lib/store/schema/SmimeType';
import { isBrowserSupported } from 'owa-smime-adapter/lib/utils/smimeUtils';
import type SmimeViewState from 'owa-smime-types/lib/schema/SmimeViewState';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import { isSmimeSettingEnabled } from 'owa-smime/lib/utils/smimeSettingsUtil';

/**
 * Should open compose as S/MIME when
 * 1. Browser is supported for S/MIME
 * 2. Enterprise users
 * 2. UserOptions.AlwaysShowFrom is not enabled in user settings
 * 3. composeOperation is supported
 * 4. S/MIME admin/user setting is enabled or parentItem is S/MIME.
 */
export const shouldOpenComposeAsSmime = (operation: ComposeOperation, item?: Item): boolean => {
    return (
        isBrowserSupported() &&
        !isConsumer() &&
        !getUserConfiguration().UserOptions.AlwaysShowFrom &&
        isSmimeSupportedInCompose(operation, item) &&
        (isSmimeSettingEnabled() || isSMIMEItem(item))
    );
};

/**
 * This util returns the SmimeViewState for the compose operation
 * respecting both Admin/User S/MIME settings.
 *
 * @param operation compose operation.
 * @param item parentItem in case of reply/forward and draftItem in case of draft.
 * @param draftSmimeType SmimeType of S/MIME draft.
 */
const tryGetSmimeViewState = async (
    operation: ComposeOperation,
    item?: Item,
    draftSmimeType?: SmimeType
): Promise<SmimeViewState> => {
    if (shouldOpenComposeAsSmime(operation, item)) {
        if (operation === ComposeOperation.EditDraft) {
            return (await lazyGetMergedSmimeViewStateForDraft.import())(draftSmimeType);
        }
        return (await lazyGetMergedSmimeViewState.import())(<ClientItem>item);
    }

    return null;
};

export default tryGetSmimeViewState;
