import * as url from "url";

import {HttpRequestType} from "../../errors";
import {PickupStore} from "../../models";
import fetch from "../../utils/fetch";
import {StoreLocationProvider} from "./";

export class ApiStoreLocationProvider implements StoreLocationProvider {
    constructor(private baseUrl: string, private locale: string) {}

    public async getStoreLocations(postalCode: string): Promise<PickupStore[]> {
        const locations = await this.getStoreLocationsFromServer(postalCode);

        return this.transformLocationToPickupStores(locations);
    }

    public async getNonKioskLocations(postalCode: string): Promise<PickupStore[]> {
        const locations = await this.getStoreLocationsFromServer(postalCode);
        return this.transformLocationToPickupStores(locations.filter(({type}) => !type.includes("Kiosk")));
    }

    public async getOnlyBigBoxLocations(postalCode: string): Promise<PickupStore[]> {
        const locations = await this.getStoreLocationsFromServer(postalCode);
        return this.transformLocationToPickupStores(locations.filter(({type}) => type.includes("BigBox")));
    }

    private async getStoreLocationsFromServer(postalCode: string): Promise<any[]> {
        const locateUrl = url.parse(this.baseUrl);
        locateUrl.query = {
            lang: this.locale,
            postalCode,
        };

        const formattedUrl = url.format(locateUrl);
        const response = await fetch(formattedUrl, HttpRequestType.LocationApi);
        const json = await response.json();

        if (json.locations === undefined || json.locations.length === 0) {
            return [];
        }
        return json.locations;
    }

    private transformLocationToPickupStores(locations: any[]): PickupStore[] {
        return locations.map((location) => ({
            address: location.address1,
            city: location.city,
            region: location.region,
            postalCode: location.postalCode,
            phoneNumber: location.phone1,
            locationId: location.locationId,
            hasInventory: false,
            name: location.name,
            hours: location.hours,
            distance: location.distance
        }));
    }
}

export default ApiStoreLocationProvider;
