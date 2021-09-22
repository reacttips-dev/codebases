import datapoints from '../../datapoints';
import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

export default action('MIGRATE_OUTLOOK_FAVORITES', () =>
    addDatapointConfig(datapoints.MigrateOutlookFavorites)
);
