import * as React from "react";
import * as classNames from "classnames";
import { PureComponent, ReactElement, StatelessComponent } from "react";
import I18n from "components/React/Filters/I18n";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { Header } from "./Header";
import { i18nFilter } from "../../../filters/ngFilters";
import { Title } from "@similarweb/ui-components/dist/title";
import { Button } from "@similarweb/ui-components/dist/button";
import { Box } from "@similarweb/ui-components/dist/box";
import { AssetsService } from "services/AssetsService";
import { BoxStates } from "../pageDefaults";
import StyledBoxSubtitle from "../../../../.pro-features/styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { SWReactIcons } from "@similarweb/icons";
import { noop } from "lodash";

const EmptySubtitle: any = styled(StyledBoxSubtitle)`
    width: 265px;
    font-size: 14px;
    text-align: center;
    color: rgba(49, 70, 93, 0.8);
`;
EmptySubtitle.displayName = "EmptySubtitle";

export const EmptyTitle: StatelessComponent<any> = (props) => {
    const { title } = props;
    const { titleText, titleUrl, titleCss, titleClick } = title;

    return (
        <Title className={classNames("Box-Title--researchHomepage--CustomAndKeyword", titleCss)}>
            <a href={titleUrl} target="_self" onClick={titleClick}>
                <I18n>{titleText}</I18n>
            </a>
        </Title>
    );
};

class PreventLink extends PureComponent<any, any> {
    private element: any;

    public componentDidMount() {
        const { onClick = noop } = this.props;
        this.element.onclick = (e) => {
            e.preventDefault();
            onClick(e);
        };
    }

    public render() {
        const { children } = this.props;
        return React.cloneElement(React.Children.only(children as ReactElement), {
            ref: (element) => (this.element = element),
        });
    }
}

export const UpgradeTitle: StatelessComponent<any> = (props) => {
    const { title } = props;
    const { titleText, titleUrl, titleCss, titleClick } = title;

    return (
        <Title className={classNames("Box-Title--researchHomepage", titleCss)}>
            <SWReactIcons iconName="locked" className="fixed-icon-height" />
            <PreventLink onClick={titleClick}>
                <a href={titleUrl}>
                    <I18n>{titleText}</I18n>
                </a>
            </PreventLink>
        </Title>
    );
};

const Aux = (props) => props.children;

export const EmptyContent: StatelessComponent<any> = (props) => {
    const { description, addLabel, imgUrl, upgrade, addClick, addComponent } = props;
    const img = AssetsService.assetUrl(`/images/${imgUrl}`);
    const buttonType = upgrade ? "upsell" : "primary";

    const button = (
        <Button key="btn" type={buttonType} onClick={addClick}>
            {i18nFilter()(addLabel)}
        </Button>
    );

    return (
        <Aux>
            <EmptySubtitle key="st">
                <I18n>{description}</I18n>
            </EmptySubtitle>
            {addClick && button}
            {addComponent && addComponent(button, { buttonWidth: "auto" })}
            <img key="img" className="Box-Img--researchHomepage-empty" src={img} />
        </Aux>
    );
};

export const UpgradeContent: StatelessComponent<any> = (props) => {
    const { description, imgUrl, upgradeClick } = props;
    const img = AssetsService.assetUrl(`/images/${imgUrl}`);

    return (
        <Aux>
            <EmptySubtitle key="st">
                <I18n>{description}</I18n>
            </EmptySubtitle>
            <Button key="btn" type="upsell" onClick={upgradeClick}>
                {i18nFilter()("research.homepage.upgrade")}
            </Button>
            <img key="img" className="Box-Img--researchHomepage-empty" src={img} />
        </Aux>
    );
};

export const UpgradeBox: StatelessComponent<any> = (props) => {
    return (
        <Box className="Box--researchHomepage Box--researchHomepage--empty">
            <UpgradeTitle {...props} />
            <UpgradeContent {...props} />
        </Box>
    );
};

export const EmptyBox: StatelessComponent<any> = (props) => {
    const shouldFadeIn = props.prevState === BoxStates.LOADING && !props.isFlipping;
    return (
        <div className="perspective">
            <Box
                className={classNames("Box--researchHomepage Box--researchHomepage--empty flip", {
                    "fade-items-in": shouldFadeIn,
                    "flip-reverse": props.isFlipping,
                })}
            >
                <EmptyTitle {...props} />
                <EmptyContent {...props} />
            </Box>
        </div>
    );
};

export const FailedMsg: StatelessComponent<any> = (props) => {
    return (
        <div className=" Box--researchHomepage--failed">
            <i className="sw-icon-no-data" />
            <span className="message-text">
                <I18n>{props.error}</I18n>
            </span>
        </div>
    );
};

export const FailedBox: StatelessComponent<any> = (props) => {
    const shouldFadeIn = props.prevState === BoxStates.LOADING && !props.isFlipping;
    return (
        <div className="perspective">
            <Box
                className={classNames("Box--researchHomepage flip", {
                    "fade-items-in": shouldFadeIn,
                    "flip-reverse": props.isFlipping,
                })}
            >
                <Header {...props} />
                <FailedMsg error={props.error} />
            </Box>
        </div>
    );
};
