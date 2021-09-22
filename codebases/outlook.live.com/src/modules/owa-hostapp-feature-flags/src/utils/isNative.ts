/*
 * This function should be used only insude owa-hostapp-feature-flags package
 */
export const isNative = () => {
    return (window as any).HxGlobals && (window as any).nativeHost;
};
