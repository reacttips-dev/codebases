export enum GuestMailTipStatus {
    // https://devblogs.microsoft.com/typescript/announcing-typescript-4-3/#union-enums-cannot-be-compared-to-arbitrary-numbers
    None = +0,
    IsCalculated = 1,
    GuestsEnabled = 2,
    GroupHasGuests = 4,
}
