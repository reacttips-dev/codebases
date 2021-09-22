import { FavoritesBitFlagsMasks, setBit } from '../helpers/favoritesBitFlagsActions';
import { lazyUpdateUserConfigurationService } from 'owa-session-store/lib/lazyFunctions';
import { getUserConfiguration } from 'owa-session-store';

export default function setOutlookFavoritesBitFlag(bitFlagToSet: FavoritesBitFlagsMasks) {
    // Update the local user configuration store
    setBit(true /* value*/, bitFlagToSet);

    // Send out request to update FavoritesBitFlags
    lazyUpdateUserConfigurationService.importAndExecute([
        {
            key: 'FavoritesBitFlags',
            valuetype: 'Integer32',
            value: [`${getUserConfiguration().UserOptions.FavoritesBitFlags}`],
        },
    ]);
}
