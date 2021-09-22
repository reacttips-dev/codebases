import React from "react";
import styled from "styled-components";
import { colorsPalettes, fonts } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { IconSidebarItem } from "@similarweb/ui-components/dist/icon-sidebar";
import {
    DigitalMarketingIcon,
    ResearchIntelligenceIcon,
    SalesIntelligenceIcon,
    ShopperIntelligenceIcon,
} from "./SolutionIcons/SolutionIcons";
import { swSettings } from "common/services/swSettings";
import { openUnlockModalV2 } from "services/ModalService";
import "./SolutionSwitcherMenu.scss";
import { UserSettingsDropDownLink } from "../UserSettingDropdown/UserSettingDropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { hasAccessToPackage } from "common/services/solutions2Helper";

const MySolutionsText = styled.div`
    margin-bottom: 24px;
    ${setFont({ $size: 12, $weight: 400, $color: colorsPalettes.carbon[400] })};
    line-height: 16px;
    padding-left: 16px;
    padding-right: 16px;
`;

const DiscoverNewSolutionsText = styled.div`
    margin-top: 16px;
    margin-bottom: 24px;
    padding: 0 16px;
    ${setFont({ $size: 12, $weight: 400, $color: colorsPalettes.carbon[400] })};
    line-height: 16px;
`;

const SolutionSwitcherItem = styled.a`
    display: flex;
    flex-direction: row;
    padding: 8px 16px;
    width: 100%;
    cursor: pointer;
    box-sizing: border-box;
    &:hover {
        background-color: ${colorsPalettes.carbon[25]};
    }
`;

const SolutionIconWrapper = styled.div`
    margin-right: 16px;
    width: 32px;
    height: 32px;
    box-sizing: border-box;
`;

const ItemTextWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const SolutionNameText = styled.div`
    ${setFont({
        $family: fonts.$dmSansFontFamily,
        $size: 14,
        $weight: 500,
        $color: colorsPalettes.midnight[600],
    })};
    margin-bottom: 8px;
    line-height: 16px;
`;

const SolutionDescriptionText = styled.div`
    ${setFont({ $size: 12, $weight: 400, $color: colorsPalettes.midnight[600] })};
    margin-bottom: 8px;
    line-height: 16px;
`;

interface IAvailableSolutions {
    solutionName: string;
    solutionDescription: string;
    linkTarget: "_self" | "_blank";
    url: string | ((isInMySolutions: boolean) => string | ((e: MouseEvent) => void));
    itemKey: string;
    icon: React.ReactNode;
    isInMySolutions: () => boolean;
}

const availableSolutions: IAvailableSolutions[] = [
    {
        solutionName: "solution_switcher.dmi.title",
        solutionDescription: "solution_switcher.dmi.desc",
        linkTarget: "_blank",
        url: (isInMySolutions) =>
            isInMySolutions
                ? "#/marketing/home"
                : (e) => {
                      e.preventDefault();
                      openUnlockModalV2("CompetitveAnalysisOverviewHomepage");
                  },
        itemKey: "marketing-solution",
        icon: <DigitalMarketingIcon />,
        isInMySolutions: () => swSettings.user.hasDM,
    },
    {
        solutionName: "solution_switcher.dri.title",
        solutionDescription: "solution_switcher.dri.desc",
        linkTarget: "_blank",
        url: (isInMySolutions) =>
            isInMySolutions
                ? "#/research/home"
                : (e) => {
                      e.preventDefault();
                      openUnlockModalV2("WebMarketAnalysisOverviewHomepage");
                  },
        itemKey: "research-solution",
        icon: <ResearchIntelligenceIcon />,
        isInMySolutions: () => swSettings.user.hasMR,
    },
    {
        solutionName: "solution_switcher.si.title",
        solutionDescription: "solution_switcher.si.desc",
        linkTarget: "_blank",
        url: (isInMySolutions) =>
            isInMySolutions ? "#/sales" : "https://www.similarweb.com/corp/sales/",
        itemKey: "sales-solution",
        icon: <SalesIntelligenceIcon />,
        isInMySolutions: () => hasAccessToPackage("salesIntelligence"),
    },
    {
        solutionName: "solution_switcher.shi.title",
        solutionDescription: "solution_switcher.shi.desc",
        linkTarget: "_blank",
        url: "https://purchase.similarweb.com/",
        itemKey: "shopper-solution",
        icon: <ShopperIntelligenceIcon />,
        isInMySolutions: () => false,
    },
];

interface ISolutionSwitcherMenuComponent {
    onClick: () => void;
    onToggle: (isOpen: boolean, isOutsideClick: boolean, e: MouseEvent) => void;
    onChildClick: () => void;
}

export const SolutionSwitcherMenuComponent: React.FC<ISolutionSwitcherMenuComponent> = ({
    onToggle,
    onChildClick,
    onClick,
}): JSX.Element => {
    const dropdownClasses = "DropdownContent-container SolutionSwitcherMenuContent-container";
    const translate = useTranslation();

    const mySolutions = [];
    const discoverSolutions = [];
    const getUrlOrHandler = (sol): string | (() => void) => {
        if (typeof sol.url === "function") {
            return sol.url(sol.isInMySolutions());
        } else {
            return sol.url;
        }
    };

    availableSolutions.forEach((sol) => {
        if (sol.isInMySolutions()) {
            mySolutions.push(sol);
        } else {
            discoverSolutions.push(sol);
        }
    });

    const mySolComponents = mySolutions.map((sol: IAvailableSolutions) => {
        const urlOrHandler = getUrlOrHandler(sol);
        const innerComponent = (
            <>
                <SolutionIconWrapper>{sol.icon}</SolutionIconWrapper>
                <ItemTextWrapper>
                    <SolutionNameText>{translate(sol.solutionName)}</SolutionNameText>
                    <SolutionDescriptionText>
                        {translate(sol.solutionDescription)}
                    </SolutionDescriptionText>
                </ItemTextWrapper>
            </>
        );

        if (typeof urlOrHandler === "function") {
            return (
                <SolutionSwitcherItem key={sol.itemKey}>
                    <UserSettingsDropDownLink onClick={urlOrHandler} preventDerfault={true}>
                        {innerComponent}
                    </UserSettingsDropDownLink>
                </SolutionSwitcherItem>
            );
        } else {
            return (
                <SolutionSwitcherItem key={sol.itemKey} href={urlOrHandler} target={sol.linkTarget}>
                    {innerComponent}
                </SolutionSwitcherItem>
            );
        }
    });

    const discoverSolutionsComponents = discoverSolutions.map((sol: IAvailableSolutions) => {
        const urlOrHandler = getUrlOrHandler(sol);
        const innerComponent = (
            <>
                <SolutionIconWrapper>{sol.icon}</SolutionIconWrapper>
                <ItemTextWrapper>
                    <SolutionNameText>{translate(sol.solutionName)}</SolutionNameText>
                    <SolutionDescriptionText>
                        {translate(sol.solutionDescription)}
                    </SolutionDescriptionText>
                </ItemTextWrapper>
            </>
        );

        if (typeof urlOrHandler === "function") {
            return (
                <SolutionSwitcherItem key={sol.itemKey}>
                    <UserSettingsDropDownLink onClick={urlOrHandler} preventDefault={true}>
                        {innerComponent}
                    </UserSettingsDropDownLink>
                </SolutionSwitcherItem>
            );
        } else {
            return (
                <SolutionSwitcherItem key={sol.itemKey} href={urlOrHandler} target={sol.linkTarget}>
                    {innerComponent}
                </SolutionSwitcherItem>
            );
        }
    });

    const getDropdownContent = (): JSX.Element[] => {
        const solutions = [];
        solutions.push(
            <MySolutionsText key="my-solutions-title">
                {translate("solution_switcher.my_solutions")}
            </MySolutionsText>,
        );
        solutions.push(...mySolComponents);

        if (discoverSolutionsComponents.length > 0) {
            solutions.push(
                <DiscoverNewSolutionsText key="new-solutions-title">
                    {translate("solution_switcher.discover")}
                </DiscoverNewSolutionsText>,
            );
            solutions.push(...discoverSolutionsComponents);
        }

        return solutions;
    };

    const onClickInternal = (item) => {
        if (item.onClick) {
            item.onClick();
        }

        onChildClick();
    };

    return (
        <Dropdown
            width={264}
            buttonWidth={"auto"}
            appendTo={"body"}
            onClick={onClickInternal}
            onToggle={onToggle}
            dropdownPopupPlacement="right"
            cssClassContainer={dropdownClasses}
            // NaN will trigger behaviour as height "auto"(desired behaviour), while not passing prop at all will trigger default value.
            dropdownPopupHeight={NaN}
        >
            {[
                <IconSidebarItem
                    key="solution-switcher"
                    icon={"solution-switcher"}
                    title={translate("solution_switcher.item_title")}
                    onItemClick={onClick}
                />,
                ...getDropdownContent(),
            ]}
        </Dropdown>
    );
};
