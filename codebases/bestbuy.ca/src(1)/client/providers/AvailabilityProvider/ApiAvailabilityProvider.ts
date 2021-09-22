import * as url from "url";
import {HttpRequestType} from "../../errors";
import {Availabilities, Availability, LevelOfService, Store} from "../../models";
import fetch from "../../utils/fetch";
import {AvailabilitiesProviderProps, AvailabilityProvider, AvailabilityProviderProps} from "./";
import {isCanadianPostalCode, stripWhiteSpaceFromPostalCode} from "utils/postalCodeUtils";

export class ApiAvailabilityProvider implements AvailabilityProvider {
    private static accept = {
        simple: "application/vnd.bestbuy.simpleproduct.v1+json",
        standard: "application/vnd.bestbuy.standardproduct.v1+json",
    };

    constructor(private baseUrl: string, private locale: Locale) {}

    public async getAvailability(
        props: AvailabilityProviderProps,
        returnSimpleProduct?: boolean,
    ): Promise<Availability> {
        let availability: Availability;
        const locations = props.storeLocations.join("|");
        const postalCode =
            props.postalCode && isCanadianPostalCode(props.postalCode)
                ? stripWhiteSpaceFromPostalCode(props.postalCode)
                : "";
        const availabilityUrl = url.parse(this.baseUrl, true);

        const skuAndSeller = props.sku.concat(props.sellerId ? `;${props.sellerId}` : "");

        availabilityUrl.query = {
            accept: returnSimpleProduct
                ? ApiAvailabilityProvider.accept.simple
                : ApiAvailabilityProvider.accept.standard,
            "accept-language": this.locale,
            locations: props.excludePickup ? undefined : locations,
            postalCode,
            skus: skuAndSeller,
        };

        const formattedUrl = url.format(availabilityUrl);
        const response = await fetch(formattedUrl, HttpRequestType.AvailabilityApi);

        // Availability returns a response wrapped with white space; node-fetch has issues handling it with usual response.json() call.
        const text = (await response.text()).trim();
        const json = JSON.parse(text);

        if (json && json.availabilities) {
            const jsonAvailability = json.availabilities[0];
            const shipping = jsonAvailability.shipping;
            const pickup = jsonAvailability.pickup;

            availability = {
                pickup: props.excludePickup
                    ? undefined
                    : {
                          purchasable: pickup && pickup.purchasable,
                          status: pickup && pickup.status,
                          stores: this._getStores(pickup),
                      },
                shipping: {
                    levelsOfServices: this._getLevelsOfServices(jsonAvailability.shipping.levelsOfServices),
                    purchasable: shipping && shipping.purchasable,
                    quantityRemaining: shipping && shipping.quantityRemaining,
                    status: shipping && shipping.status,
                },
                sku: jsonAvailability.sku,
                isGiftCard: jsonAvailability.isGiftCard,
                isService: jsonAvailability.isService,
                scheduledDelivery: jsonAvailability.scheduledDelivery,
            };
        }

        return availability;
    }

    public async getAvailabilities(props?: AvailabilitiesProviderProps): Promise<any> {
        const skus = props.skus.length > 1 ? props.skus.join("|") : props.skus[0];
        const locations = props.storeLocations.join("|");
        const postalCode =
            props.postalCode && isCanadianPostalCode(props.postalCode)
                ? stripWhiteSpaceFromPostalCode(props.postalCode)
                : "";

        const availabilityUrl = url.parse(this.baseUrl, true);
        availabilityUrl.query = {
            accept: ApiAvailabilityProvider.accept.simple,
            "accept-language": this.locale,
            locations: props.excludePickup ? undefined : locations,
            postalCode,
            skus,
        };

        const formattedUrl = url.format(availabilityUrl);
        const response = await fetch(formattedUrl, HttpRequestType.AvailabilityApi);
        return response.json();
    }

    public async getAvailabilitiesIndexedBySku(props?: AvailabilitiesProviderProps): Promise<Availabilities> {
        const availabilities: Availabilities = {};

        const json = await this.getAvailabilities(props);

        if (json && json.availabilities) {
            for (const jsonAvailability of json.availabilities) {
                const shipping = jsonAvailability.shipping;
                const pickup = jsonAvailability.pickup;
                const availability: Availability = {
                    pickup: props.excludePickup
                        ? undefined
                        : {
                              purchasable: pickup && pickup.purchasable,
                              status: pickup && pickup.status,
                          },
                    shipping: {
                        levelsOfServices: this._getLevelsOfServices(jsonAvailability.shipping.levelsOfServices),
                        purchasable: shipping && shipping.purchasable,
                        quantityRemaining: shipping && shipping.quantityRemaining,
                        status: shipping && shipping.status,
                    },
                    sku: jsonAvailability.sku,
                };
                availabilities[jsonAvailability.sku] = availability;
            }
        }

        return availabilities;
    }

    private _getStores(pickup: any): Store[] {
        if (!pickup || !pickup.locations || pickup.locations.length === 0) {
            return;
        }

        const stores: Store[] = [];

        for (const location of pickup.locations) {
            stores.push({
                hasInventory: location.hasInventory,
                locationId: location.locationKey,
                name: location.name,
                quantityOnHand: location.quantityOnHand,
            });
        }

        return stores;
    }

    private _getLevelsOfServices(levelsOfServices: any): LevelOfService[] {
        if (!Array.isArray(levelsOfServices) || !levelsOfServices.length) {
            return null;
        }

        const prioritizeFreeShipping = (los1, los2) => {
            if (los1.price === los2.price) {
                return 0;
            }
            return los1.price > los2.price ? 1 : -1;
        };

        return levelsOfServices.sort(prioritizeFreeShipping).map(
            ({deliveryDate, deliveryDateExpiresOn, deliveryDatePrecision, price}) =>
                ({
                    deliveryDate,
                    deliveryDateExpiresOn,
                    deliveryDatePrecision,
                    price,
                } as LevelOfService),
        );
    }
}

export default ApiAvailabilityProvider;
