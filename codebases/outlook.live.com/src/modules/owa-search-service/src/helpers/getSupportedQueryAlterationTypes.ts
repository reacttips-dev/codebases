import { isFeatureEnabled } from 'owa-feature-flags';

export default function getSupportedQueryAlterationTypes(): string[] {
    const supportedQueryAlterationTypes = [
        'Suggestion',
        'NoResultModification',
        'NoResultFolderRefinerModification',
        'NoRequeryModification',
        'Modification',
    ];

    if (isFeatureEnabled('sea-extensionQueryAlteration')) {
        supportedQueryAlterationTypes.push('Extension');
    }

    return supportedQueryAlterationTypes;
}
