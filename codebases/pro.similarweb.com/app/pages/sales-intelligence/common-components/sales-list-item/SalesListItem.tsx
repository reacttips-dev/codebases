import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { getSingularOrPluralKey } from "../../helpers/helpers";
import * as styles from "./styles";

type SalesListItemProps = {
    name: string;
    iconName: string;
    numberOfWebsites: number;
    numberOfNewWebsites?: number;
    dataAutomation: string;
    onClick(): void;
};

const SalesListItem: React.FC<SalesListItemProps> = (props) => {
    const {
        name,
        iconName,
        numberOfWebsites,
        numberOfNewWebsites = 0,
        dataAutomation,
        onClick,
    } = props;
    const translate = useTranslation();
    const getSecondaryTextKey = getSingularOrPluralKey("si.common.number_of_websites");

    return (
        <styles.StyledSalesListItem onClick={onClick} data-automation={dataAutomation}>
            <styles.StyledSalesListItemIcon>
                <SWReactIcons iconName={iconName} size="sm" />
            </styles.StyledSalesListItemIcon>
            <styles.StyledSalesListItemTextContainer>
                <styles.StyledSalesListItemPrimaryText>
                    <span>{name}</span>
                </styles.StyledSalesListItemPrimaryText>
                <styles.StyledSalesListItemSecondaryText>
                    <span>
                        {translate(getSecondaryTextKey(numberOfWebsites), { numberOfWebsites })}
                    </span>
                    {numberOfNewWebsites > 0 && (
                        <>
                            <styles.StyledSalesListItemNewWebsitesText>
                                <span>&nbsp;{String.fromCharCode(8226)}&nbsp;</span>
                                <span>
                                    {translate("si.components.saved_searches_dropdown.new_text", {
                                        numberOfNewResults: numberOfNewWebsites,
                                    })}
                                </span>
                            </styles.StyledSalesListItemNewWebsitesText>
                        </>
                    )}
                </styles.StyledSalesListItemSecondaryText>
            </styles.StyledSalesListItemTextContainer>
        </styles.StyledSalesListItem>
    );
};

export default SalesListItem;
