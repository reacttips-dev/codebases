import { swSettings } from "common/services/swSettings";
import { FC } from "react";
import dayjs from "dayjs";
import { ButtonPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { BoxStates, getTitleUrl, resourcesNames, trackEvents } from "../../pageDefaults";
import { ReadyBoxCustomizable } from "../ReadyBox";
import { EmptyBox, FailedBox, UpgradeBox } from "../FailedBox";
import { i18nFilter } from "filters/ngFilters";
import { LoadingBox } from "../LoadingBox";
import { Settings } from "./Settings";

export const CustomCategories: FC<any> = (props) => {
    const rn = resourcesNames.customCategories;
    switch (props.state) {
        case BoxStates.LOADING:
            return (
                <LoadingBox resourceName={rn}>
                    <ButtonPlaceholderLoader id={`${rn}_lb`} className="Loader--button" />
                </LoadingBox>
            );
        case BoxStates.READY:
            return <ReadyBoxCustomizable {...props} {...getHeaderProps(props)} />;
        case BoxStates.FAILED:
            return (
                <FailedBox
                    {...props}
                    {...getHeaderProps(props)}
                    error="something.went.wrong.error.message"
                />
            );
        case BoxStates.EMPTY:
            return <EmptyBox {...props} {...getHeaderProps(props)} {...getEmptyProps(props)} />;
        case BoxStates.SETTINGS:
            return <Settings {...props} {...getHeaderProps(props)} />;
        case BoxStates.UPGRADE:
            return (
                <UpgradeBox
                    {...props}
                    {...getHeaderProps(props)}
                    {...getEmptyProps(props)}
                    {...getUpgradeProps(props)}
                />
            );
    }
};

const getEmptyProps = (props) => {
    return {
        addLabel: "research.homepage.customcategories.addCategory",
        description: "research.homepage.customcategories.description",
        imgUrl: "Custom-category.svg",
    };
};

const getTitleProps = (props) => ({
    ...titleProps,
    titleUrl: getTitleUrl("industryAnalysis-overview", { ...props.filters, category: "All" }),
});

const getHeaderProps = (props) => {
    const date = dayjs
        .utc(swSettings.components.IndustryAnalysis.resources.SupportedDate, "YYYY-MM-DD")
        .format("MMM, YYYY");
    const resourceName = resourcesNames.customCategories;
    const title = getTitleProps(props);

    return {
        tooltip: {
            tooltipText: "research.homepage.customcategories.tooltip",
            tooltipParams: { date },
        },
        subtitle: i18nFilter()("common.country." + props.filters.country),
        addClick: addCategories.bind(this, props.addClick),
        resourceName,
        title,
    };
};

const titleProps = {
    titleText: "research.homepage.customcategories.title",
    titleClick: () =>
        trackEvents(resourcesNames.customCategories, "Internal Link", "click", "Industry Analysis"),
};
const baseLocation = "Hook PRO/Home/Modules/Custom Categories";
const getUpgradeProps = (props) => ({
    title: {
        ...getTitleProps(props),
        titleClick: () => {
            trackEvents(resourcesNames.customCategories, "Add new attribute/upgrade", "click");
            props.onUpgrade(`${baseLocation}/title/click`);
        },
    },
    upgradeClick: () => {
        trackEvents(resourcesNames.customCategories, "Add new attribute/upgrade", "click");
        props.onUpgrade(`${baseLocation}/Upgrade button/click`);
    },
});

function addCategories(addClick) {
    trackEvents(resourcesNames.customCategories, "Add new attribute", "click");
    addClick();
}
