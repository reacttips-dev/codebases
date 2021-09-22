import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { Tab } from "@similarweb/ui-components/dist/tabs";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import React from "react";

export const AutocompletePlaceholderText = styled.span`
    color: ${colorsPalettes.carbon["300"]};
    font-family: ${$robotoFontFamily};
    font-size: 14px;
    margin-left: 32px;
`;

export const AutocompleteStyled = styled(Autocomplete)`
    width: 100%;

    // TODO: needs to be removed after ui-componet bug is fixed
    &.autoCompleteActive {
        > div {
            padding: 7px 0;
            transform: translateY(-7px);
            box-shadow: 0px 3px 5px 0px ${rgba(colorsPalettes.carbon[500], 0.12)};
            background-color: ${colorsPalettes.carbon[0]};
            border-top: none;
        }
    }
`;

export const ScrollAreaWrap = React.forwardRef((props: any, ref: any) => (
    <ScrollArea
        style={{ maxHeight: 360, minHeight: 0 }}
        verticalScrollbarStyle={{ borderRadius: 5 }}
        horizontal={false}
        smoothScrolling={true}
        minScrollSize={48}
        ref={ref}
        {...props}
    />
));

export const ScrollAreaRecents = ({ children, ...rest }) => {
    return (
        <ScrollAreaWrap style={{ maxHeight: 410 }} {...rest}>
            {children}
        </ScrollAreaWrap>
    );
};

ScrollAreaWrap.displayName = "ScrollAreaWrap";

export const TabStyled = styled(Tab)`
    ${SWReactIcons} {
    margin-right: 8px;
  };
  &:hover {
    svg {
        path {fill: ${colorsPalettes.carbon[500]};}
    }
  }
    &.selected {
        svg {
            path {fill: ${colorsPalettes.blue[400]};}
        }
    }
  }
`;
