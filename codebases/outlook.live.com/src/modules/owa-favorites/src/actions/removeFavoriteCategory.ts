import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Remove a favorite category
 * @param categoryId the id to be removed
 * @param actionSource where the remove action is triggered
 */
export default action('REMOVE_FAVORITE_CATEGORY', (categoryId: string, actionSource: string) =>
    addDatapointConfig(
        {
            name: isFeatureEnabled('tri-favorites-roaming')
                ? 'RemoveFavoriteCategoryV2'
                : 'RemoveFavoriteCategoryV1',
            customData: {
                actionSource,
            },
        },
        {
            categoryId,
            actionSource,
        }
    )
);
