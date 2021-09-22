import {Coordinates, PickupStore, Region} from "models";

export interface User {
    cart?: Cart;
    shippingLocation: UserShippingLocation;
    geoLocation?: Coordinates;
    preference?: Preference;
    isGetLocationLoading?: boolean;
    isGetLocationError?: boolean;
    regionCode?: Region;
}

export interface UserShippingLocation {
    city: string;
    country: string;
    postalCode: string;
    regionCode: Region;
    regionName: string;
    nearbyStores: PickupStore[];
}

export interface Cart {
    count: number;
}

export interface Preference {
    geoLocation: string;
}

export enum UserDefaultLocation {
    city = "Toronto",
    country = "Canada",
    postalCode = "M5G 2C3",
    regionCode = "ON",
    regionName = "Ontario",
}
