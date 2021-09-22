import WebsiteSniffer from "./WebsiteSniffer";

export default class IndustrySniffer extends WebsiteSniffer {
    constructor(metric, store) {
        super(metric, store);
    }

    getSampleKey() {
        return {
            id: "$Gambling",
            name: "Gambling",
            icon: "sprite-category Gambling",
            isVirtual: false,
            type: "Industry",
            category: "$Gambling",
        };
    }
}
