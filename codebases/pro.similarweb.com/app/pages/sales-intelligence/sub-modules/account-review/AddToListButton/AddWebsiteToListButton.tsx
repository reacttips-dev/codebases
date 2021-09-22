import React from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { StarButtonStyle } from "components/React/FavIcon/FaviconButton";
import { useTranslation } from "components/WithTranslation/src/I18n";
import * as classNames from "classnames";
import AddToListDropdownContainer from "../../opportunities/components/AddToListDropdown/AddToListDropdownContainer";
import { OpportunityListType } from "../../opportunities/types";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";

export type AddWebsiteToListButtonProps = {
    domain: string;
    opportunityLists: OpportunityListType[];
    disabledText?: string;
    staticStarIcon?: "star-full" | "star-outline";
    isWhiteIcon?: boolean;
    disabledListsNames: string[];
    alreadyInList: boolean;
    withLoadingState?: boolean;
};

const noop = () => undefined;

const AddWebsiteToListButton = ({
    domain,
    staticStarIcon,
    disabledText,
    isWhiteIcon,
    disabledListsNames,
    alreadyInList,
    withLoadingState,
    navigator,
}: AddWebsiteToListButtonProps & WithSWNavigatorProps) => {
    const translate = useTranslation();
    const renderStarIconButton = (onClick: () => void) => {
        return (
            <PlainTooltip
                placement="bottom"
                cssClass="plainTooltip-element PlainTooltip--favoritesStar favorites"
                tooltipContent={translate("si.pages.account_review.add_to_list_button.tooltip")}
            >
                <StarButtonStyle className={classNames({ white: isWhiteIcon })}>
                    <IconButton
                        type="flat"
                        onClick={onClick}
                        dataAutomation="add-website-to-static-list-button"
                        iconName={staticStarIcon || (alreadyInList ? "star-full" : "star-outline")}
                    />
                </StarButtonStyle>
            </PlainTooltip>
        );
    };

    return (
        <AddToListDropdownContainer
            disabledText={disabledText}
            disabledLists={disabledListsNames}
            onDone={noop}
            domains={[domain]}
            withLoadingState={withLoadingState}
            renderDropdownButton={renderStarIconButton}
            isOldSales={navigator.isOldSales()}
        />
    );
};

export default AddWebsiteToListButton;
