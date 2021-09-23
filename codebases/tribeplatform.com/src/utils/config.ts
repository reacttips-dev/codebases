import getConfig from 'next/config';
export const getRuntimeConfigVariable = (variableName) => {
    const { publicRuntimeConfig } = getConfig();
    return publicRuntimeConfig[variableName] || undefined;
};
//# sourceMappingURL=config.js.map