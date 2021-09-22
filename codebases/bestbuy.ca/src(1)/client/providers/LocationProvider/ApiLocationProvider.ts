import * as url from "url";
import {HttpRequestType} from "../../errors";
import {Coordinates, Location, NearbyStore} from "../../models";
import fetch from "../../utils/fetch";
import {LocationProvider} from "./";

export class ApiLocationProvider implements LocationProvider {
    constructor(private baseUrl: string, private locale: string) {}

    public async locate(includeStores: boolean, coords?: Coordinates, postalCode?: string): Promise<Location> {
        const locateUrl = url.parse(this.baseUrl);
        locateUrl.query = {
            includeStores,
            lang: this.locale,
        };

        if (coords) {
            locateUrl.query.lat = coords.latitude;
            locateUrl.query.long = coords.longitude;
        } else if (postalCode) {
            locateUrl.query.postalCode = postalCode;
        }

        const formattedUrl = url.format(locateUrl);
        const response = await fetch(formattedUrl, HttpRequestType.LocationApi);
        const json = await response.json();

        const location: Location = {
            city: json.city,
            nearbyStores: this.getNearbyStores(json.nearbyStores),
            postalCode: json.postalCode,
            regionCode: json.region,
            country: json.country,
        };

        return location;
    }

    private getNearbyStores(jsonNearbyStores: any[]): NearbyStore[] {
        const nearbyStores: NearbyStore[] = [];

        if (jsonNearbyStores && jsonNearbyStores.length > 0) {
            for (const store of jsonNearbyStores) {
                // filter out ExpressKiosks and MobileKiosks
                if (!store.type.includes("Kiosk")) {
                    const nearbyStore: NearbyStore = {
                        locationId: store.locationId,
                        name: store.name,
                    };

                    nearbyStores.push(nearbyStore);
                }
            }
        }
        return nearbyStores;
    }
}
export default ApiLocationProvider;
