import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Add a favorite category
 * @param categoryId the id to be added
 * @param actionSource where the add action is triggered
 */
export default action('ADD_FAVORITE_CATEGORY', (categoryId: string, actionSource: string) =>
    addDatapointConfig(
        {
            name: isFeatureEnabled('tri-favorites-roaming')
                ? 'AddFavoriteCategoryV2'
                : 'AddFavoriteCategoryV1',
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
