import { BulletLegends } from "components/React/Legends/BulletLegends";
import * as React from "react";
import SimpleLegend, { simpleLegendProps } from "components/React/legend/simpleLegend";
import ComponentSubtitle, {
    componentSubTitleProps,
} from "components/React/ComponentSubtitle/ComponentSubtitle";
import { Injector } from "common/ioc/Injector";
import * as propTypes from "prop-types";

export type PageSubtitleAndLegendProps = {
    getLegendConfig?(): simpleLegendProps;
    getSubTitleConfig?(): componentSubTitleProps;
    className?: string;
};

export function getSubTitleConfigDefault(): componentSubTitleProps {
    return Injector.get<any>("swNavigator").getParams();
}

export function getLegendConfigDefault(): simpleLegendProps {
    const chosenSites = Injector.get<any>("chosenSites");
    const isCompare = chosenSites.isCompare();
    return {
        items: isCompare
            ? chosenSites.sitelistForLegend().map((site) => ({
                  ...site,
                  isDisabled: false,
              }))
            : [],
        className: "u-flex-wrap",
    };
}

const PageSubtitleAndLegend: React.StatelessComponent<PageSubtitleAndLegendProps> = ({
    className,
    getLegendConfig,
    getSubTitleConfig,
}) => {
    const subTitleSettings = getSubTitleConfig();
    const legendSettings = getLegendConfig();
    const items = legendSettings.items;

    return (
        <div className={`page-title-legend-container ${className}`}>
            <ComponentSubtitle {...subTitleSettings} />
            <BulletLegends legendItems={items} />
        </div>
    );
};

PageSubtitleAndLegend.propTypes = {
    getLegendConfig: propTypes.func.isRequired,
    getSubTitleConfig: propTypes.func.isRequired,
    className: propTypes.string,
};

PageSubtitleAndLegend.defaultProps = {
    getLegendConfig: getLegendConfigDefault,
    getSubTitleConfig: getSubTitleConfigDefault,
    className: "",
};

export default PageSubtitleAndLegend;
