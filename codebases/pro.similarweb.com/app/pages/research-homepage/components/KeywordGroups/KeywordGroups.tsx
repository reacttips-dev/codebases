import { Button } from "@similarweb/ui-components/dist/button";
import { ButtonPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import { KeywordsGroupEditorModal } from "pages/keyword-analysis/KeywordsGroupEditorModal";
import { FC, useState } from "react";
import { allTrackers } from "services/track/track";
import { KeywordGroupCreationDropdown } from "../../../../../.pro-features/components/GroupCreationDropdown/src/KeywordGroupCreationDropdown";
import TranslationProvider from "../../../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { BoxStates, getTitleUrl, resourcesNames, trackEvents } from "../../pageDefaults";
import { EmptyBox, FailedBox, UpgradeBox } from "../FailedBox";
import { LoadingBox } from "../LoadingBox";
import { ReadyBoxCustomizable } from "../ReadyBox";
import { Settings } from "./Settings";

export const KeywordGroups: FC<any> = (props) => {
    const rn = resourcesNames.keywordGroups;
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
        addLabel: "research.homepage.keywordgroups.addKeyword",
        description: "research.homepage.keywordgroups.description",
        imgUrl: "Keyword-group.svg",
    };
};

const getLastScrapingMonth = (props) => {
    const { LastScrapingMonth = "" } = props.table.data.find((r) => r.LastScrapingMonth) || {};
    const dayjsLastScrapingMonth = dayjs.utc(LastScrapingMonth, "YYYY-MM-DD");
    if (dayjsLastScrapingMonth.isValid()) {
        return dayjsLastScrapingMonth.format("MMM, YYYY");
    }
    return i18nFilter()("research.homepage.keywordgroups.tooltip.noscrapingdate");
};

const getTitleProps = (props) => ({
    ...titleProps,
    titleUrl: getTitleUrl("keywordAnalysis-home", props.filters),
});

const onGeneratorToolClick = () => {
    allTrackers.trackEvent("Button", "click", "Keyword generator tool");
    Injector.get<any>("swNavigator").go("keywordAnalysis-keywordGeneratorTool");
};

const getHeaderProps = (props) => {
    const [isOpen, setIsOpen] = useState<boolean>();

    const date =
        props.state === BoxStates.READY
            ? getLastScrapingMonth(props)
            : i18nFilter()("research.homepage.keywordgroups.tooltip.noscrapingdate");
    const title = getTitleProps(props);
    const resourceName = resourcesNames.keywordGroups;
    const isFroUser = swSettings.user.isFro;

    const editGroup = () => {
        trackEvents(resourcesNames.keywordGroups, "Add new attribute", "click");
        setIsOpen(true);
    };

    const addComponent = (button, componentProps = {}) => (
        <TranslationProvider translate={i18nFilter()}>
            <KeywordGroupCreationDropdown
                onKeywordsModalClick={editGroup}
                onGeneratorToolClick={onGeneratorToolClick}
                bubbleClass="keywords-generator-notification-homepage"
                bubbleDirection="right"
                hasKeywordsGenerator={swSettings.components.KeywordsGenerator.isAllowed}
                hideNotification={isFroUser}
                {...componentProps}
            >
                {button || <Button type="primary">{i18nFilter()("research.homepage.add")}</Button>}
            </KeywordGroupCreationDropdown>
            <KeywordsGroupEditorModal
                onClose={() => setIsOpen(false)}
                open={isOpen}
                keywordsGroup={{} as any}
                onSave={props.onAdd}
            />
        </TranslationProvider>
    );

    return {
        tooltip: {
            tooltipText: "research.homepage.keywordgroups.tooltip",
            tooltipParams: { date },
        },
        subtitle: i18nFilter()("common.country." + props.filters.country),
        addComponent,
        resourceName,
        title,
    };
};

const titleProps = {
    titleText: "research.homepage.keywordgroups.title",
    titleClick: () =>
        trackEvents(resourcesNames.keywordGroups, "Internal Link", "click", "Keyword Analysis"),
};

const baseLocation = "Hook PRO/Home/Modules/Keyword Groups";
const getUpgradeProps = (props) => ({
    title: {
        ...getTitleProps(props),
        titleClick: () => {
            trackEvents(resourcesNames.keywordGroups, "Add new attribute/upgrade", "click");
            props.onUpgrade(`${baseLocation}/title/click`);
        },
    },
    upgradeClick: () => {
        trackEvents(resourcesNames.keywordGroups, "Add new attribute/upgrade", "click");
        props.onUpgrade(`${baseLocation}/Upgrade button/click`);
    },
});
