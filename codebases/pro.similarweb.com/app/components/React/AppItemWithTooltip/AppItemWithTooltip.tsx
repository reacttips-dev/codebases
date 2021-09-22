import { Injector } from "common/ioc/Injector";
import { AppTooltip } from "components/tooltips/src/AppTooltip/AppTooltip";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { isSalesIntelligenceAppsState } from "pages/sales-intelligence/helpers/helpers";
import PropTypes from "prop-types";
import * as React from "react";
import { SwNavigator } from "../../../../scripts/common/services/swNavigator";

export interface IAppItemWithTooltip {
    apps: any;
    store: string;
    onClick?: any;
    onClickTrackTitle?: string;
    aClassName?: string;
    imgClassName?: string;
    limitApps?: number;
}

export const AppItemWithTooltip: React.FC<IAppItemWithTooltip> = ({
    apps,
    onClick,
    store,
    limitApps,
    onClickTrackTitle,
    aClassName,
    imgClassName,
}) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const handleClick = (title, onClickTrackTitle) => (e) => {
        if (typeof onClick === "function") {
            onClick(title, onClickTrackTitle);
        }
    };
    const items = apps.slice(0, limitApps).map((item, index) => {
        const AppId = item.appId || item.AppId;
        const state = isSalesIntelligenceAppsState(swNavigator)
            ? "salesIntelligence-apps-performance"
            : "apps-performance";

        const redirectURL = swNavigator.getStateUrl(state, {
            appId: AppId,
            country: 840,
            duration: "1m",
        });
        return (
            <AppTooltip
                key={index}
                appId={AppId ? AppId.substring(2, AppId.length) : AppId}
                store={store}
                placement={"bottom"}
            >
                <a
                    className={aClassName}
                    href={redirectURL}
                    onClick={handleClick(item.title, onClickTrackTitle)}
                >
                    <img
                        className={imgClassName}
                        src={item.icon || item.Icon}
                        alt={item.title || item.Title}
                    />
                </a>
            </AppTooltip>
        );
    });
    return items;
};
AppItemWithTooltip.defaultProps = {
    limitApps: 5,
    onClick: null,
};

AppItemWithTooltip.propTypes = {
    apps: PropTypes.any.isRequired,
    store: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    onClickTrackTitle: PropTypes.string,
    aClassName: PropTypes.string,
    imgClassName: PropTypes.string,
    limitApps: PropTypes.number,
};
export default SWReactRootComponent(AppItemWithTooltip, "AppItemWithTooltip");
