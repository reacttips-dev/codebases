import WebsiteSniffer from "./WebsiteSniffer";
export default class KeywordSniffer extends WebsiteSniffer {
    constructor(metric, store) {
        super(metric, store);
    }

    getSampleKey() {
        return {
            name: "shoes",
            image:
                "https://site-images.similarcdn.com/image?url=shoes&t=2&s=1&h=12644678989360049915",
            isVirtual: false,
            type: "Keyword",
        };
    }
}
