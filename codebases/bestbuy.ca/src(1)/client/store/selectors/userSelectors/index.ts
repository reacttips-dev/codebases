import {createSelector, Selector} from "reselect";
import {get} from "lodash-es";
import {State} from "store";

type User = State["user"];
type ShippingLocation = State["user"]["shippingLocation"];
type Preference = State["user"]["preference"];
type City = State["user"]["shippingLocation"]["city"];
type PostalCode = State["user"]["shippingLocation"]["postalCode"];
type RegionCode = State["user"]["shippingLocation"]["regionCode"];
type NearbyStores = State["user"]["shippingLocation"]["nearbyStores"];

export const getUser: Selector<State, User> = (state: State) => state.user;

export const getUserShippingLocation = createSelector<State, User, ShippingLocation>([getUser], (user) =>
    get(user, "shippingLocation"),
);

export const getUserPreference = createSelector<State, User, Preference>([getUser], (user) => get(user, "preference"));

export const getUserShippingLocationCity = createSelector<State, ShippingLocation, City>(
    [getUserShippingLocation],
    (userShippingLocation) => get(userShippingLocation, "city"),
);

export const getUserShippingLocationPostalCode = createSelector<State, ShippingLocation, PostalCode>(
    [getUserShippingLocation],
    (userShippingLocation) => get(userShippingLocation, "postalCode"),
);

export const getUserShippingLocationRegionCode = createSelector<State, ShippingLocation, RegionCode>(
    [getUserShippingLocation],
    (userShippingLocation) => get(userShippingLocation, "regionCode"),
);

export const getUserShippingLocationNearbyStores = createSelector<State, ShippingLocation, NearbyStores>(
    [getUserShippingLocation],
    (userShippingLocation) => get(userShippingLocation, "nearbyStores"),
);

export const getUserShippingLocationIds = createSelector<State, NearbyStores, string[]>(
    [getUserShippingLocationNearbyStores],
    (nearbyStores) => nearbyStores.map(({locationId}) => locationId),
);
