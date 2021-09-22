import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";

export interface ITrafficChannelsService {
    getAvailableTrafficChannels: () => any[];
}

export class TrafficChannelsService implements ITrafficChannelsService {
    private i18nFilter = i18nFilter();

    public getAvailableTrafficChannels(): any[] {
        return [
            {
                text: this.i18nFilter("traffic.channel.dashboard.wizard.direct"),
                name: "Direct",
                id: "Direct",
                innerOrder: 0,
            },
            {
                text: this.i18nFilter("traffic.channel.dashboard.wizard.mail"),
                name: "Email",
                id: "Email",
                innerOrder: 1,
            },
            {
                text: this.i18nFilter("traffic.channel.dashboard.wizard.referrals"),
                name: "Referrals",
                id: "Referrals",
                innerOrder: 2,
            },
            {
                text: this.i18nFilter("traffic.channel.dashboard.wizard.social"),
                name: "Social",
                id: "Social",
                innerOrder: 3,
            },
            {
                text: this.i18nFilter("traffic.channel.dashboard.wizard.organic.search"),
                name: "Organic Search",
                id: "Organic Search",
                innerOrder: 4,
            },
            {
                text: this.i18nFilter("traffic.channel.dashboard.wizard.paid.search"),
                name: "Paid Search",
                id: "Paid Search",
                innerOrder: 5,
            },
            {
                text: this.i18nFilter("traffic.channel.dashboard.wizard.display.ads"),
                name: "Display Ads",
                id: "Display Ads",
                innerOrder: 6,
            },
        ];
    }

    public getChannelById(requestedId) {
        if (requestedId == undefined) {
            return undefined;
        }
        let result = _.filter(this.getAvailableTrafficChannels(), { id: requestedId });
        if (result && result.length > 0) {
            return result[0];
        }
        return undefined;
    }
}

export const trafficChannelsService = new TrafficChannelsService();
