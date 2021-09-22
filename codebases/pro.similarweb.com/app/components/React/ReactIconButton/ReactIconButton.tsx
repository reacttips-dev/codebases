import { IconButton } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";
import * as React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { StatelessComponent } from "react";
import { i18nFilter } from "../../../filters/ngFilters";

export const ReactIconButtonWrapper = styled.div`
    position: relative;
`;

export const ReactIconButton: StatelessComponent<any> = (props) => {
    const definedProps = {
        type: "flat",
        ...props,
    };
    const label = i18nFilter()(definedProps.text);

    return (
        <div data-automation={definedProps.iconName}>
            <ReactIconButtonWrapper>
                <IconButton {...definedProps}>{label}</IconButton>
            </ReactIconButtonWrapper>
        </div>
    );
};

export default SWReactRootComponent(ReactIconButton, "ReactIconButton");
