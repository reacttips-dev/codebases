// These IDs are used by the GetItemManager in order to fetch items from the mail store.
// Note that the GetItemManager itself does not know about these IDs. It utilizes them
// by initializing ItemPropertyEntry objects, such as smartReplyItemPropertyEntry.ts.
export enum GetItemManagerFeatureIds {
    LanguageAndLocale = 'SmartPill_LanguageAndLocale',
    SmartDoc = 'SmartPill_SmartDoc',
    SmartReply = 'SmartPill_SmartReply',
    SmartTime = 'SmartPill_SmartTime',
}

export const enum Languages {
    English = 'English',
    Spanish = 'Spanish',
}

export const enum FeatureNames {
    SmartDoc = 'SmartDoc',
    SmartTime = 'SmartTime',
    SmartReply = 'SmartReply',
}

export const enum FlightNames {
    SmartDoc = 'mc-smartReplyWithDoc',
    SmartReply = 'mc-smartReply',
    SmartReplySpanishMexico = 'mc-smartReplySpanishMexico',
    SmartReplyWithCustomMeetingTime = 'mc-smartReplyWithCustomMeeting',
}

export interface SmartPillsAggregatedByFeature {
    [featureName: string]: number;
}

export interface SmartPillsFeatureArrangement {
    aggregation: SmartPillsAggregatedByFeature;
    arrangement: FeatureNames[];
}

/**
 * Confidence level are defined in High (default), Mid, and Low
 */
export const enum SmartTimeConfidenceLevel {
    High = 90,
    Mid = 70,
}
