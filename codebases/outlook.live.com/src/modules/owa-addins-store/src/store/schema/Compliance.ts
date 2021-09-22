export interface Compliance {
    isMinor: boolean;
}

export function initializeCompliance(): Compliance {
    return {
        isMinor: false,
    };
}
