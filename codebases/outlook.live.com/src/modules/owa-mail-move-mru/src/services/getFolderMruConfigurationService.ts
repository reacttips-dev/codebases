import type TargetFolderMruConfiguration from 'owa-service/lib/contract/TargetFolderMruConfiguration';
import getFolderMruConfiguration from 'owa-service/lib/operation/getFolderMruConfigurationOperation';

/**
 * Action to get folder MRU Configuration
 * @return the TargetFolderMruConfiguration
 */
export default function getFolderMruConfigurationService(): Promise<TargetFolderMruConfiguration> {
    return getFolderMruConfiguration().then(response => {
        return response;
    });
}
