export const getSavedProperties = (assets, assetType) =>
    assets.items.filter((item) => item.data.type === assetType);

export const getRecentByType = (recents, assetType) =>
    recents.filter((item) => item.data.type === assetType);
