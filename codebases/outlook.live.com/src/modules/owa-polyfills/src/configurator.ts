import configurator from 'core-js/configurator';
configurator({
    useNative: ['Array.values', 'Array.keys', 'Array.entries'], // polyfills will be used only if native is completely unavailable
});
