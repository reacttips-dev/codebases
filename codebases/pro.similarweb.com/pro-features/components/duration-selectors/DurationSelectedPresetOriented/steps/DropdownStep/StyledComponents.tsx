import { FC } from "react";
import styled from "styled-components";
import omit from "lodash/omit";
import { SimpleDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { PropsOf } from "helpers/types/react";
import { colorsPalettes } from "@similarweb/styles";

export const DropdownItemUnselectable: FC<PropsOf<typeof SimpleDropdownItem>> = (props) => (
    <SimpleDropdownItem {...omit(props, "selected")} />
);

export const DropdownItem = styled(DropdownItemUnselectable)`
    text-indent: 0;
    padding: 14px 16px;
    color: #2a3e52;
    font-size: 14px;
    line-height: 16px;
    height: auto;
    font-style: normal;
    font-weight: normal;
    background: ${(p) => (p.selected ? colorsPalettes.bluegrey[100] : colorsPalettes.carbon[0])};

    &:hover {
        background: #f4f5f6;
    }
`;

export const DropdownItemDate = styled.span`
    color: #7f8b97;
`;

export const BottomSection = styled.div`
    border-top: 1px solid ${colorsPalettes.carbon[200]};
    padding: 7px 9px 8px;
`;
