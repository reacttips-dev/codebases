import * as querystring from "querystring";
export const ConfirmitURLBuilder = {
    buildConfirmitURL: (props) => {
        // In ecomm-webapp part of the render occurs on the server side which doesn't contain the window object
        const isWindowDefined = typeof window !== "undefined";
        const params = querystring.stringify({
            "exit-page": isWindowDefined ? window.location.href : "",
            locale: props.locale,
            "page-view": props.pageView ? props.pageView.toString() : "0",
            referrer: props.referrer ? props.referrer : "",
            "screen-height": isWindowDefined ? window.outerHeight.toString() : "0",
            "screen-width": isWindowDefined ? window.outerWidth.toString() : "0",
            "survey-time": Date.now().toString(),
            "window-height": isWindowDefined ? window.innerHeight.toString() : "0",
            "window-width": isWindowDefined ? window.innerWidth.toString() : "0",
        });
        return `${props.baseUrl}&${params}`;
    },
};
export default ConfirmitURLBuilder;
//# sourceMappingURL=ConfirmitURLBuilder.js.map