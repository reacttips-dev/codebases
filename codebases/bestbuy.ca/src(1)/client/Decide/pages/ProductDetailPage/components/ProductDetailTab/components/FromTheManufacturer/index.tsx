import * as React from "react";
import State from "store";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import * as styles from "../../style.css";
import messages from "../../translations/messages";
import useTrackTabVisit from "hooks/useTrackVisit";
import {OneWorldSyncWindow, SyndigoWindow} from "models";
import {FlixMedia} from "./components/FlixMedia";

export interface Props {
    sku: string;
}
export interface StateProps {
    language: Language;
    modelNumber: string;
    brand: string;
    oneWorldSyncContentAggregationEnabled: boolean;
    syndigoContentAggregationEnabled: boolean;
    flixMediaContentAggregationEnabled: boolean;
}

const SYNDI_POWERPAGE_CONTAINER_ID = "wc-power-page";
const ONEWORLDSYNC_CONTAINER_ID = "ccs-inline-content";
const FROM_THE_MANUFACTURER_CONTAINER = "fromTheManufacturerContainer";

export const FromTheManufacturer: React.FC<Props & StateProps> = ({
    sku,
    language,
    modelNumber,
    brand,
    oneWorldSyncContentAggregationEnabled,
    syndigoContentAggregationEnabled,
    flixMediaContentAggregationEnabled,
}) => {
    let fromTheManufacturerMutationObserver: MutationObserver;
    const {ref: containerRef, inView: containerInView} = useTrackTabVisit({
        payload: {
            sku,
            customLink: "From The Manufacturer Impression",
        },
        event: "PDP_TAB_IMPRESSION",
    });
    const [showFallbackMessage, setShowFallbackMessage] = React.useState(true);
    const [hideSyndigoContent, setHideSyndigoContent] = React.useState(false);
    const [hideFlixMediaContent, setHideFlixMediaContent] = React.useState(false);

    React.useEffect(() => {
        const container = document.getElementById(FROM_THE_MANUFACTURER_CONTAINER);
        const fromTheManufacturerOnChange = () => {
            const oneWorldSyncContent = container?.querySelector(`#${ONEWORLDSYNC_CONTAINER_ID}`)?.children.length;
            const syndiPowerPage = container?.querySelector("#syndi_powerpage");
            const syndiShadowRoot = syndiPowerPage?.querySelector(".syndigo-shadowed-powerpage")?.shadowRoot;
            const flixContainer = container?.querySelector("#flix-inpage");
            const flixContent = flixContainer?.querySelector("#inpage_container");
            let isElementWithChildNodesFound = false;

            while (syndiPowerPage && syndiPowerPage.children.length > 1) {
                syndiPowerPage.removeChild(syndiPowerPage.childNodes[syndiPowerPage.children.length - 1]);
            }
            // remove duplicate flix content
            flixContainer?.querySelectorAll('[id^="flixinpage_"]').forEach((element) => {
                if (element.hasChildNodes()) {
                    if (!isElementWithChildNodesFound) {
                        isElementWithChildNodesFound = true;
                    } else {
                        flixContainer?.removeChild(element);
                    }
                }
            });

            setHideFlixMediaContent(!!oneWorldSyncContent);
            setHideSyndigoContent(!!oneWorldSyncContent || !!flixContent);
            // show fallback message when data is unavailable from syndigo/oneworldsync/flix
            setShowFallbackMessage(!syndiShadowRoot && !oneWorldSyncContent && !flixContent);

            // Override Syndigo styles. Since it is a shadow object, the styles must be applied inline.
            syndiShadowRoot
                ?.querySelector(".syndi_powerpage")
                ?.querySelector(".syndigo-widget-section-header")
                ?.setAttribute("style", "margin-top: 0;");
        };

        fromTheManufacturerMutationObserver = new MutationObserver(fromTheManufacturerOnChange);
        if (container) {
            fromTheManufacturerMutationObserver.observe(container, {
                attributes: false,
                childList: true,
                characterData: false,
                subtree: true,
            });
        }

        return () => {
            if (fromTheManufacturerMutationObserver) {
                fromTheManufacturerMutationObserver.disconnect();
            }
        };
    }, []);

    React.useEffect(() => {
        try {
            if (oneWorldSyncContentAggregationEnabled) {
                const oneWorldSyncWindow = (window as any) as OneWorldSyncWindow;
                oneWorldSyncWindow.ccs_cc_args = [];
                oneWorldSyncWindow.ccs_cc_args.push(["_SKey", "9a0ba13d"]);
                oneWorldSyncWindow.ccs_cc_args.push(["_ZoneId", "3b41c554f5"]);
                oneWorldSyncWindow.ccs_cc_args.push(["_host", "ws.cnetcontent.com"]);
                oneWorldSyncWindow.ccs_cc_args.push(["cpn", sku]);
                oneWorldSyncWindow.ccs_cc_args.push(["lang", language]);

                if (oneWorldSyncWindow && oneWorldSyncWindow.ccs_cc_load_content) {
                    oneWorldSyncWindow.ccs_cc_set_param("mf", brand);
                    oneWorldSyncWindow.ccs_cc_set_param("pn", modelNumber);
                    oneWorldSyncWindow.ccs_cc_set_param("market", "CA");
                    oneWorldSyncWindow.ccs_cc_load_content();
                }
            }
            if (syndigoContentAggregationEnabled && !hideSyndigoContent) {
                const syndiWindow = (window as any) as SyndigoWindow;
                syndiWindow.SYNDI = syndiWindow.SYNDI || [];
                if (syndiWindow.SYNDI.reset) {
                    syndiWindow.SYNDI.reset();
                }
                syndiWindow.SYNDI.push(sku);
            }
        } catch (error) {
            console.error(error);
        }
    }, [sku, containerInView, syndigoContentAggregationEnabled, oneWorldSyncContentAggregationEnabled]);

    return (
        <div id={FROM_THE_MANUFACTURER_CONTAINER} className={styles.fromTheManufacturerContainer} ref={containerRef}>
            {showFallbackMessage && (
                <p className={styles.defaultText}>
                    <FormattedMessage {...messages.fromTheManufacturerDefaultText} />
                </p>
            )}
            <div id={ONEWORLDSYNC_CONTAINER_ID}></div>
            {!hideFlixMediaContent && flixMediaContentAggregationEnabled && (
                <FlixMedia
                    modelNumber={modelNumber}
                    distributor="3882"
                    fallbackLanguage={language}
                    language={language === "en" ? "b5" : "c4"}
                    brand={brand}
                    sku={sku}
                />
            )}
            {!hideSyndigoContent && <div id={SYNDI_POWERPAGE_CONTAINER_ID}></div>}
        </div>
    );
};

const mapStateToProps = (state: State): StateProps => ({
    language: state.intl.language,
    modelNumber: state.product?.product?.modelNumber,
    brand: state.product?.product?.brandName,
    syndigoContentAggregationEnabled: !!state.config.features.syndigoContentAggregationEnabled,
    oneWorldSyncContentAggregationEnabled: !!state.config.features.oneWorldSyncContentAggregationEnabled,
    flixMediaContentAggregationEnabled: !!state.config.features.flixMediaContentAggregationEnabled,
});

export default connect(mapStateToProps)(FromTheManufacturer);
