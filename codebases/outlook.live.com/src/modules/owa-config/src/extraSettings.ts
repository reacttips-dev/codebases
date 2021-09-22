import type { SWTracing } from 'owa-serviceworker-common';

export interface ExtraSettings {
    featureOverrides?: string[];
    swTracing?: SWTracing;
    clientTracing?: string;
}

let extraSettings: ExtraSettings = {};
export function parseExtraSettings(value: string): ExtraSettings {
    if (value) {
        try {
            extraSettings = JSON.parse(value) as ExtraSettings;
        } catch {}
    }
    return extraSettings;
}

export function getExtraSettings(): ExtraSettings {
    return extraSettings;
}
