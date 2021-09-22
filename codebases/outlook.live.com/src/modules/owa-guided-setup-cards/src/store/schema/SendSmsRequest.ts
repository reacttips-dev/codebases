export interface SendSmsRequest {
    sendTo: string;
    countryCode: string;
    coid: string;
    containerName: ContainerName;
    userType: SmsUserType;
    experimentName: ExperimentName;
    hostName?: string;
}

export enum ContainerName {
    EmptyState = 0,
    GetStarted = 1,
    OpxHost = 2,
    ExternalPartner = 3,
}

export enum SmsUserType {
    Consumer = 0,
    Business = 1,
    Edu = 2,
}

export enum ExperimentName {
    SmsOnly = 0,
    QR = 1,
}
