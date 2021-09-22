import * as React from "react";
import * as classNames from "classnames";
import { Button } from "@similarweb/ui-components/dist/button";
import { Title } from "@similarweb/ui-components/dist/title";
import I18n from "components/React/Filters/I18n";
import { i18nFilter } from "filters/ngFilters";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { SettingsButton } from "./SettingsButton";
import { BoxStates } from "../pageDefaults";
import { SWReactIcons } from "@similarweb/icons";
import StyledBoxSubtitle from "../../../../.pro-features/styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";

export const HeaderSubtitle: any = styled(StyledBoxSubtitle)`
    height: 18px;
    pointer-events: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const Header: any = (props) => {
    const { title, tooltip, subtitle, resourceName, toggleSettings, state } = props;
    const { tooltipText, tooltipParams } = tooltip;
    const { titleText, titleUrl, titleCss, titleClick } = title;

    return (
        <div className={"Box-Header--researchHomepage"}>
            <Title
                className={classNames(
                    "u-flex-space-between",
                    "Box-Title--researchHomepage",
                    titleCss,
                )}
            >
                <div className="title-text-container">
                    <a href={titleUrl} target="_self" onClick={titleClick}>
                        <I18n>{titleText}</I18n>
                    </a>
                    <span
                        className="scss-tooltip scss-tooltip--s"
                        data-scss-tooltip={i18nFilter()(tooltipText, tooltipParams)}
                    >
                        <SWReactIcons iconName="info" className="info-icon" />
                    </span>
                </div>
                <div>
                    <SettingsButton
                        className="settings-btn"
                        onClick={() => toggleSettings(resourceName, state, BoxStates.SETTINGS)}
                    />
                </div>
            </Title>
            <HeaderSubtitle>{subtitle}</HeaderSubtitle>
            <div className="line-separator"></div>
        </div>
    );
};

export const HeaderCustomizable: any = (props) => {
    const {
        title,
        tooltip,
        subtitle,
        addClick,
        addComponent,
        resourceName,
        toggleSettings,
        state,
    } = props;
    const { tooltipText, tooltipParams } = tooltip;
    const { titleText, titleUrl, titleCss, titleClick } = title;

    const button = (
        <Button
            height={36}
            width={80}
            className="Box-Add-Button--researchHomepage u-uppercase"
            onClick={addClick}
        >
            {i18nFilter()("research.homepage.add")}
        </Button>
    );

    return (
        <div className={"Box-Header--researchHomepage"}>
            <Title
                className={classNames(
                    "u-flex-space-between",
                    "Box-Title--researchHomepage",
                    titleCss,
                )}
            >
                <div className="title-text-container">
                    <a href={titleUrl} target="_self" onClick={titleClick}>
                        <I18n>{titleText}</I18n>
                    </a>
                    <span
                        className="scss-tooltip scss-tooltip--s"
                        data-scss-tooltip={i18nFilter()(tooltipText, tooltipParams)}
                    >
                        <SWReactIcons iconName="info" className="info-icon" />
                    </span>
                </div>
                <div className="u-flex-row">
                    <SettingsButton
                        className="settings-btn"
                        onClick={() => toggleSettings(resourceName, state, BoxStates.SETTINGS)}
                    />
                    {addClick && button}
                    {addComponent && addComponent(button)}
                </div>
            </Title>
            <HeaderSubtitle>{subtitle}</HeaderSubtitle>
            <div className="line-separator" />
        </div>
    );
};
