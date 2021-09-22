type DefaultFlagMap = { [feature: string]: true };

let defaultFlags: DefaultFlagMap = {};

export function setDefaultFlags(newMap: DefaultFlagMap) {
    defaultFlags = newMap;
}

export function getDefaultFlags(): DefaultFlagMap {
    return defaultFlags;
}
