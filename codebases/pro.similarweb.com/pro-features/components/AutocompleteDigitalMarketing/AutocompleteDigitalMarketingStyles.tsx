import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import React from "react";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";

export const PlaceholderText = styled.span`
    color: ${colorsPalettes.carbon["300"]};
    font-family: ${$robotoFontFamily};
    font-size: 14px;
    margin-left: 32px;
`;

export const BoldPlaceholderText = styled.span`
    font-weight: 500;
`;

export const AutocompleteStyled = styled(Autocomplete)`
    width: 100%;
`;

export const ScrollAreaWrap = ({ children, ...rest }) => {
    return (
        <ScrollArea
            style={{ maxHeight: 400, minHeight: 0 }}
            verticalScrollbarStyle={{ borderRadius: 5 }}
            horizontal={false}
            smoothScrolling={true}
            minScrollSize={48}
            {...rest}
        >
            {children}
        </ScrollArea>
    );
};
