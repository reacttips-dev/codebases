import * as React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import {
    IWebsiteListTypeSelectorProps,
    WebsiteListTypeSelector,
} from "../../../.pro-features/components/WebsiteListTypeSelector/src/WebsiteListTypeSelector";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { i18nFilter } from "filters/ngFilters";

export const WebsiteListTypeSelectorContainerWrapper = styled.div`
    border: 1px solid ${colorsPalettes.carbon["50"]};
`;

export const WebsiteListTypeSelectorContainer: React.StatelessComponent<IWebsiteListTypeSelectorProps> = ({
    onListTypeSelect,
    selectedListType,
    disabled,
}) => {
    const selector = (
        <WebsiteListTypeSelectorContainerWrapper>
            <WebsiteListTypeSelector
                disabled={disabled}
                selectedListType={selectedListType}
                onListTypeSelect={onListTypeSelect}
                containerClass="WebsiteListTypeSelector"
            />
        </WebsiteListTypeSelectorContainerWrapper>
    );

    return selector;
};

SWReactRootComponent(WebsiteListTypeSelectorContainer, "WebsiteListTypeSelectorContainer");
