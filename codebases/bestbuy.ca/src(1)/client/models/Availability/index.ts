export interface Availability {
    pickup: Pickup;
    shipping: Shipping;
    sku: string;
    isGiftCard: boolean;
    isService: boolean;
}

export enum AvailabilityPickupStatus {
    Unknown = "Unknown",
    InStock = "InStock",
    OutOfStock = "OutOfStock",
    Preorder = "Preorder",
    NotAvailable = "NotAvailable",
    ComingSoon = "ComingSoon",
    OnlineOnly = "OnlineOnly",
}

export enum AvailabilityShippingStatus {
    Unknown = "Unknown",
    InStock = "InStock",
    Preorder = "Preorder",
    ComingSoon = "ComingSoon",
    SoldOutOnline = "SoldOutOnline",
    NotAvailable = "NotAvailable",
    BackOrder = "BackOrder",
    OutofStockInRegion = "OutofStockInRegion",
    CannotShipToLocation = "CannotShipToLocation",
    RegionRestricted = "RegionRestricted",
    InStoreOnly = "InStoreOnly",
    InStockOnlineOnly = "InStockOnlineOnly",
}

export interface AvailabilityReduxStore {
    pickup: PickupWithAddress;
    shipping: Shipping;
    sku: string;
    isGiftCard: boolean;
    isService: boolean;
    scheduledDelivery?: boolean;
}

export interface AvailabilityResponse {
    pickup: PickupStatus;
    shipping: ShippingStatus;
    sku: string;
    sellerId: string;
    saleChannelExclusivity: string;
    scheduledDelivery: boolean;
    isGiftCard: boolean;
    isService: boolean;
}

export interface AvailabilitiesResponse {
    availabilities: AvailabilityResponse[];
}

export interface Availabilities {
    [sku: string]: Availability;
}

export interface LevelOfService {
    carrierId: string;
    carrierName: string;
    deliveryDate: Date;
    deliveryDateExpiresOn: Date;
    deliveryDatePrecision: string;
    id: string;
    name: string;
    price: number;
}

export interface Pickup extends PickupStatus {
    stores?: Store[];
}

export interface PickupWithAddress extends Status {
    stores?: PickupStore[];
}

export interface Shipping extends Status {
    quantityRemaining?: number;
    releaseDate?: string;
    levelsOfServices?: LevelOfService[];
}

export interface Status {
    status: string;
    purchasable: boolean;
}

export interface PickupStatus {
    status: AvailabilityPickupStatus;
    purchasable: boolean;
}

export interface ShippingStatus {
    status: AvailabilityShippingStatus;
    purchasable: boolean;
}

export interface Store {
    hasInventory: boolean;
    locationId: string;
    name: string;
    quantityOnHand: number;
}

export interface PickupStore extends Store {
    address: string;
    city: string;
    region: string;
    postalCode: string;
    phoneNumber: string;
    hours: string[];
    distance: number;
}

export interface StoreBasicInfo {
    postalCode: string;
    status: StoreStatuses;
    storeName?: string;
    city?: string;
    province?: string;
    pickupOpeningHoursOffset?: number;
    pickupClosingHoursOffset?: number;
}

export interface StoreLocationById {
    [key: string]: StoreBasicInfo;
}

export interface RetailStoreStatus {
    isLoading: boolean;
    statuses: StoreLocationById;
}

export enum StoreStatuses {
    open = "open",
    open_reduced_hours = "open_reduced_hours",
    ppu_curbside_pickup = "rpu_curbside_pickup",
    rpu_store_front_pickup = "rpu_store_front_pickup",
    ppu_instore_pickup = "ppu_instore_pickup",
    closed = "closed",
}

export interface StoreMessage {
    en: string;
    fr: string;
}

export interface StoreMessageById {
    [key: string]: StoreMessage;
}

export interface StoreMessages {
    isLoading: boolean;
    messages: StoreMessageById;
}
