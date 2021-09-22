import * as React from "react";
import { AppTooltip } from "components/tooltips/src/AppTooltip/AppTooltip";
import PropTypes from "prop-types";
import { usePosition } from "./usePosition";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import {
    AppIconImage,
    AppIconLink,
    CarouselContainer,
    CarouselContainerInner,
    LeftButton,
    RightButton,
} from "components/React/AppItemWithTooltip/styles";

export interface IAppItemWithTooltip {
    apps: any;
    store: string;
    onClick?: any;
    onClickTrackTitle?: string;
    aClassName?: string;
    imgClassName?: string;
    limitApps?: number;
}

const WebsitePerformanceAppItem: React.FC<IAppItemWithTooltip & WithSWNavigatorProps> = ({
    apps,
    onClick,
    navigator,
    store,
    limitApps,
    onClickTrackTitle,
}) => {
    const ref = React.useRef();
    const { hasItemsOnLeft, hasItemsOnRight, scrollRight, scrollLeft } = usePosition(
        ref,
        limitApps,
    );

    const handleClick = (title, onClickTrackTitle) => (e) => {
        if (typeof onClick === "function") {
            onClick(title, onClickTrackTitle);
        }
    };

    const state =
        navigator.current().parent === "accountreview_website"
            ? "salesIntelligence-apps-performance"
            : "apps-performance";

    const items = apps.slice(0, limitApps).map((item, index) => {
        const AppId = item.appId || item.AppId;
        const redirectURL = navigator.getStateUrl(state, {
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
                <AppIconLink
                    href={redirectURL}
                    onClick={handleClick(item.title, onClickTrackTitle)}
                >
                    <AppIconImage src={item.icon || item.Icon} alt={item.title || item.Title} />
                </AppIconLink>
            </AppTooltip>
        );
    });
    return (
        <CarouselContainer role="region" aria-label="Related apps">
            {(hasItemsOnLeft || hasItemsOnRight) && (
                <LeftButton
                    iconSize="md"
                    iconName="chev-left-n"
                    onClick={scrollLeft}
                    isDisabled={!hasItemsOnLeft}
                    type="flat"
                    width="32px"
                    height="32px"
                />
            )}
            <CarouselContainerInner ref={ref}>{items}</CarouselContainerInner>
            {(hasItemsOnLeft || hasItemsOnRight) && (
                <RightButton
                    iconSize="md"
                    iconName="chev-right-n"
                    onClick={scrollRight}
                    isDisabled={!hasItemsOnRight}
                    type="flat"
                    width="32px"
                    height="32px"
                />
            )}
        </CarouselContainer>
    );
};

WebsitePerformanceAppItem.defaultProps = {
    limitApps: 5,
    onClick: null,
};

export default withSWNavigator(WebsitePerformanceAppItem);

WebsitePerformanceAppItem.propTypes = {
    apps: PropTypes.any.isRequired,
    store: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    onClickTrackTitle: PropTypes.string,
    aClassName: PropTypes.string,
    imgClassName: PropTypes.string,
    limitApps: PropTypes.number,
};
