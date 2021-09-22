import type WindowFeaturesOptions from './store/schema/WindowFeaturesOptions';

export default {
    PopoutAddPopout: {
        name: 'PopoutAddPopout',
        // Only store first section of route since the other parts may contain id which is PII.
        customData: (
            vdir: 'mail' | 'calendar',
            route: string,
            data?: Object | (() => Promise<Object>),
            options?: Partial<WindowFeaturesOptions>,
            skipOptinCheck?: boolean,
            actionSource?: string
        ) => [(route || '').split('/')[0], actionSource],
    },
};
