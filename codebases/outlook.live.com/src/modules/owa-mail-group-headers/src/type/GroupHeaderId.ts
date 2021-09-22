/**
 * NOTE: All enums within this file share the same value pool,
 * meaning that all enums should have unique values, even between
 * sets (i.e. cannot have value 1 in both NoGroupHeaderId AND
 * TimeHeaderId).
 */
export type GroupHeaderId =
    | NoGroupHeaderId
    | SizeHeaderId
    | TimeHeaderId
    | SenderGroupHeaderId
    | NudgedGroupHeaderId
    | PinnedGroupHeaderId
    | string;

export enum NoGroupHeaderId {
    None = 0,
}

export enum TimeHeaderId {
    Pinned = 1,
    Today = 2,
    Yesterday = 3,
    ThisWeek = 4,
    LastWeek = 5,
    ThisMonth = 6,
    LastMonth = 7,
    Older = 8,
    OneMonthOlder = 9,
    TwoMonthsOlder = 10,
}

export enum SizeHeaderId {
    Tiny = 11, // > 0kb
    Small = 12, // > 10kb
    Medium = 13, // > 25kb
    Large = 14, // > 100kb
    VeryLarge = 15, // > 500kb
    Huge = 16, // > 1MB
    Enormous = 17, // > 5MB
}

export enum SenderGroupHeaderId {
    Unknown = 18,
}

export enum NudgedGroupHeaderId {
    Nudged = 19,
}

export enum PinnedGroupHeaderId {
    Pinned = 20,
}
