export class CanadaPostAddressComplete {
    constructor(config) {
        this.position = { x: 0, y: 0 };
        this.canadaPostJsUrl = "//www.bestbuy.ca/ns-static/js/addresscomplete/addresscomplete-2.30.min.js";
        this.canadaPostCssUrl = "//www.bestbuy.ca/ns-static/css/addresscomplete/addresscomplete-2.30.min.css";
        this.setFields = (fields, onAddressSelected, config = {}) => {
            if (typeof pca === "undefined") {
                const script = document.createElement("script");
                script.src = this.canadaPostJsUrl;
                const styles = document.createElement("link");
                styles.rel = "stylesheet";
                styles.href = this.canadaPostCssUrl;
                document.body.appendChild(script);
                document.body.appendChild(styles);
                script.onload = () => {
                    this.initFields(config, fields, onAddressSelected);
                };
            }
            else {
                this.initFields(config, fields, onAddressSelected);
            }
        };
        this.config = config;
    }
    initFields(config, fields, onAddressSelected) {
        const options = Object.assign(Object.assign({}, this.config), config);
        if (options.key && typeof pca !== "undefined" && pca.Address) {
            new pca.Address(fields, options).listen("populate", (addressData) => {
                onAddressSelected(this.formatReturnedFields(fields, addressData));
            });
            document.ontouchstart = (e) => {
                this.position.x = e.changedTouches[0].pageX;
                this.position.y = e.changedTouches[0].pageY;
            };
            document.ontouchend = (e) => {
                if (document.activeElement &&
                    !e.target.className.startsWith("pca") &&
                    !fields.find((field) => field.element === e.target.id) &&
                    (this.position.x === e.changedTouches[0].pageX || this.position.y === e.changedTouches[0].pageY)) {
                    document.activeElement.blur();
                }
            };
        }
    }
    formatReturnedFields(fields, addressData) {
        const addressFields = {};
        for (const field of fields) {
            const k = field.element;
            const data = field.field;
            k === "postalCode" && addressData.CountryIso2 === "US"
                ? (addressFields[k] = addressData[data].substring(0, 5) || "")
                : (addressFields[k] = addressData[data] || "");
        }
        return addressFields;
    }
}
const canadaPostAddressComplete = new CanadaPostAddressComplete({
    bar: {
        showCountry: true,
    },
});
export default canadaPostAddressComplete;
//# sourceMappingURL=CanadaPostAddressComplete.js.map