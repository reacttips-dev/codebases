import { lazyUpdateUserConfigurationService } from 'owa-session-store';

export default function updateFavoritesUserOptionService(
    newFavoritesNodesRaw: string[]
): Promise<void> {
    return lazyUpdateUserConfigurationService
        .importAndExecute([
            {
                key: 'FavoriteNodes',
                valuetype: 'StringArray',
                value: newFavoritesNodesRaw,
            },
        ])
        .then(response => {
            const responseItem = response.Body.ResponseMessages.Items[0];
            if (responseItem.ResponseClass == 'Success') {
                return Promise.resolve();
            } else {
                return Promise.reject(
                    'updateUserConfiguration failed: ' + responseItem.ResponseClass
                );
            }
        });
}
