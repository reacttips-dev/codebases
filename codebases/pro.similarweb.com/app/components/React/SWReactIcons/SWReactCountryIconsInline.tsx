import * as React from "react";

import styled from "styled-components";
import { SWReactCountryIcons } from "@similarweb/icons";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import CountryService from "services/CountryService";

interface ISWReactCountryIconsInline {
    countryCode: number;
    className: string;
}
const US_COUNTRY_ID = 840;

const SWReactCountryIconsInlineContainer = styled(SWReactCountryIcons)<ISWReactCountryIconsInline>`
    width: 1em;
    height: 1em;
    margin-right: 5px;
    position: relative;
    top: 1px;
    display: inline-block;
`;

export const SWReactCountryIconsInline = ({ countryCode }) => {
    const fixedCountryCode = CountryService.isUSState(countryCode) ? US_COUNTRY_ID : countryCode;
    return (
        <SWReactCountryIconsInlineContainer
            countryCode={fixedCountryCode}
            className={"inline-flag"}
        />
    );
};

export default SWReactRootComponent(SWReactCountryIconsInline, "SWReactCountryIconsInline");
