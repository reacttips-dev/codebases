import {StatusCode} from "errors";

export interface CellPhonePlanPricing {
    sku: string;
    carrier: string;
    carrierID: CellPhoneCarrierID;
    downPayment: number;
    monthly?: number;
    giftCard?: number;
    planTier?: string;
}

export type CellPhonePlanPricingApiResponse = CellPhonePlanPricing[];

export interface CellPhonePlanPricingApiError {
    error: {
        code: StatusCode;
        message: string;
    };
}

export interface CellPhonePlanStore extends CellPhonePlanPricing {
    loading: boolean;
}

export enum CellPhoneCarrierName {
    Telus = "Telus",
    Rogers = "Rogers",
    Bell = "Bell",
    Koodo = "Koodo",
    Fido = "Fido",
    Virgin = "Virgin Mobile",
    Shaw = "Shaw",
    Freedom = "Freedom",
}

export enum CellPhoneCarrierID {
    Telus = "TEL",
    Rogers = "ROG",
    Bell = "BEL",
    Koodo = "KDO",
    Fido = "FDO",
    Virgin = "VMO",
    Shaw = "SHW",
    Freedom = "FRD",
}

export enum ActivationTypes {
    Upgrade = "Upgrading my phone with my current carrier",
    NewActivation = "Getting a new plan with a new phone",
    AddDeviceToNewLine = "Add a phone to my current plan",
    InStoreEligible = "Not sure yet",
}

export enum UpgradeEligibilityActivationTypes {
    ADD = "ADD",
    NEW = "NEW",
    UPG = "UPG",
}

export interface CellPhoneUpgradeEligibility {
    activationType?: string;
    mobileNumber: string;
    postalCode?: string;
    carrierId: string;
}

export interface CellPhoneUpgradeEligibilityGenericResponse {
    success?: CellPhoneUpgradeEligibilityResponse;
    error?: CellPhoneUpgradeEligibilityApiError;
}

export interface CellPhoneUpgradeEligibilityResponse {
    carrierId: string;
    upgradeEligible?: boolean;
    balance: number;
}

export interface CellPhoneUpgradeEligibilityApiError {
    resultCode?: number;
    resultDetails: string;
}

export enum CarrierError {
    invalidPhone = 30656,
    invalidPostalCode = 30438,
}

export enum EligibilityResultTypes {
    Balance = "Balance",
    NoBalance = "No Balance",
    NotEligible = "Not Eligible",
    InStoreEligible = "In Store Eligible",
}

export enum MobileActivationStep {
    ActivationType = "activation type",
    EligibilityResult = "eligibility results",
}

export interface CarrierMetaDataApiResponse {
    carrierId: CellPhoneCarrierID;
    upgradeCheck: FieldsMetadata;
}

interface FieldsMetadata {
    requiredMobileNumber: boolean;
    requiredPostalCode: boolean;
}

export interface KeyValue<T> {
    [key: string]: T | null;
}
export type MobileActivationEligibilityCheckStore = KeyValue<FieldsMetadata>;
