import * as React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { BoldPlaceholderText, PlaceholderText } from "./styles";

const PlaceholderComponent = (): JSX.Element => {
    const translate = useTranslation();

    return (
        <PlaceholderText>
            {translate("marketintelligence.companyresearch.apps.home.searchText")}&nbsp;
            <BoldPlaceholderText>
                {translate("marketintelligence.companyresearch.apps.home.searchItem")}
            </BoldPlaceholderText>
        </PlaceholderText>
    );
};

export default PlaceholderComponent;
