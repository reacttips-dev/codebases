export const getMidgardBootstrapperAsync = () =>
    import(/* webpackChunkName: "MidgardBootstrapper"*/ '@1js/midgard-bootstrapper');

export const initializeLivePersonaCardAsync = async config =>
    (await getMidgardBootstrapperAsync()).initializeLivePersonaCardAsync(config);

export const initializeLivePersonaEditorAsync = async config =>
    (await getMidgardBootstrapperAsync()).initializeLivePersonaEditorAsync(config);
