import * as React from "react";
import {useEffect} from "react";

export interface Props {
    language: string;
    postalCode: string;
    storeId: string;
}

export const Flyer = React.memo((props: Props) => {
    const initializeFlyerScript = () => {
        if (typeof window !== "undefined") {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://flyer-script.bestbuy.ca/hosted_services/iframe.js";
            script.async = true;
            script.onload = () => {
                updateFlyer();
            };
            document.getElementsByTagName("body")[0].appendChild(script);
        }
    };

    const updateFlyer = () => {
        if (!(window as any).wishabi) {
            return;
        }

        const pageSizing = "PAGE";
        const minHeight = 600;
        const initialHeight = 1000;
        const extraPadding = 0;
        const queryParameters = getQueryString();

        // tslint:disable-next-line:no-unused-expression
        new (window as any).wishabi.hostedservices.iframe.decorate(
            "circ_div",
            "bestbuy",
            (window as any).wishabi.hostedservices.iframe.Sizing[pageSizing],
            {
                minHeight,
                initialHeight,
                extraPadding,
                queryParameters,
            },
        );
    };

    const getQueryString = () => {
        const queryParams = props.storeId
            ? {
                  locale: props.language,
                  store_code: props.storeId || "",
              }
            : {
                  locale: props.language,
                  postal_code: props.postalCode && props.postalCode.replace(" ", ""),
              };

        return Object.keys(queryParams)
            .map((key) => `${key}=${queryParams[key]}`)
            .join("&");
    };

    useEffect(() => {
        updateFlyer();
    });

    initializeFlyerScript();

    return <div id="circ_div" data-automation="flyer_init_div" />;
}, flyerPropsAreEqual);

function flyerPropsAreEqual(prevFlyer, nextFlyer) {
    return prevFlyer.storeId === nextFlyer.storeId;
}

export default Flyer;
