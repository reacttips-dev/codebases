import * as React from "react";
import * as PropTypes from "prop-types";
import { colorsPalettes, getBrightnessHEX } from "@similarweb/styles";
import { StatelessComponent } from "react";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { TrafficShareWithTooltip } from "../../../../.pro-features/components/TrafficShare/src/TrafficShareWithTooltip";
import { DefaultFrameLoader } from "../widgetFrames/simpleFrame";
import TranslationProvider from "../../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { i18nFilter } from "../../../filters/ngFilters";

const MetricsCompareBars: StatelessComponent<any> = ({
    items,
    textMinValue,
    isFetching,
    ...props
}) => {
    const data =
        items[0] &&
        items[0].bars.map((item) => {
            return {
                color:
                    getBrightnessHEX(item.color) === "dark"
                        ? colorsPalettes.carbon[0]
                        : colorsPalettes.midnight[600],
                backgroundColor: item.color,
                width: item.width / 100,
                text: item.valueText,
                name: item.name,
            };
        });
    return (
        <TranslationProvider translate={i18nFilter()}>
            <div className="metrics-bars-container" {...props}>
                {isFetching && <DefaultFrameLoader />}
                {!isFetching && (
                    <TrafficShareWithTooltip data={data} barGap={2} title={props.title} />
                )}
            </div>
        </TranslationProvider>
    );
};

MetricsCompareBars.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            metric: PropTypes.string,
            bars: PropTypes.arrayOf(
                PropTypes.shape({
                    valueText: PropTypes.string.isRequired,
                    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                    color: PropTypes.string.isRequired,
                }),
            ).isRequired,
        }),
    ).isRequired,
    textMinValue: PropTypes.number,
};

MetricsCompareBars.defaultProps = {
    textMinValue: 3,
};

export default MetricsCompareBars;
SWReactRootComponent(MetricsCompareBars, "MetricsCompareBars");
