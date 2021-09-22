export enum AMPAvailability {
    None = 'none',
    AmpDisabled = 'ampDisabled',
    MessageUnsafe = 'messageUnsafe',
    SenderNotAllowed = 'sendNotAllowed',
    BrowserNotSupported = 'browserNotSupported',
    AmpNotValidated = 'ampNotValidated',
    AmpValidationFailed = 'ampValidationFailed',
    AmpValidated = 'ampValidated',
}

export default interface AmpViewState {
    preferAmp: boolean;
    ampAvailability: AMPAvailability;
}
