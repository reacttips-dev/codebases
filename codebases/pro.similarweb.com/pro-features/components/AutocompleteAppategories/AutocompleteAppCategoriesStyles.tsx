import { SWReactIcons } from "@similarweb/icons";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { Tab } from "@similarweb/ui-components/dist/tabs";
import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

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

export const AutocompleteStyled = styled(Autocomplete)`
    width: 100%;
`;

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
