import {defineMessages, FormattedMessage} from "react-intl";

const messages: {[key: string]: FormattedMessage.MessageDescriptor} = defineMessages({
    today: {id: "storeLocatorPage.storeHoursTable.today"},
    tomorrow: {id: "storeLocatorPage.storeHoursTable.tomorrow"},
    weekDay0: {id: "storeLocatorPage.storeHoursTable.weekDay0"},
    weekDay1: {id: "storeLocatorPage.storeHoursTable.weekDay1"},
    weekDay2: {id: "storeLocatorPage.storeHoursTable.weekDay2"},
    weekDay3: {id: "storeLocatorPage.storeHoursTable.weekDay3"},
    weekDay4: {id: "storeLocatorPage.storeHoursTable.weekDay4"},
    weekDay5: {id: "storeLocatorPage.storeHoursTable.weekDay5"},
    weekDay6: {id: "storeLocatorPage.storeHoursTable.weekDay6"},
    closed: {id: "storeLocatorPage.storeHoursTable.closed"},
    inStorePickupOnlyHeader: {id: "storeLocatorPage.storeHoursTable.inStorePickupOnlyHeader"},
    pickupHoursHeader: {id: "storeLocatorPage.storeHoursTable.pickupHoursHeader"},
});

export default messages;
