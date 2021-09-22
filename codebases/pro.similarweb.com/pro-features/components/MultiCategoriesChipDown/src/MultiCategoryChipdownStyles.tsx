import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { MultiSelectCategoryDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import styled from "styled-components";

export const DropdownItem: any = styled(MultiSelectCategoryDropdownItem)`
    font-size: 14px;
    ${SWReactIcons}:first-child {
        width: 16px;
        height: 16px;
        svg {
            width: 16px;
            height: 16px;
        }
    }
`;

interface FooterButton {
    disabled?: boolean;
}

export const FooterButton = styled.div<FooterButton>`
    height: 40px;
    width: 100%;
    background-color: ${colorsPalettes.blue[400]};
    display: flex;
    flex-direction: row-reverse;
    padding: 0 16px;
    align-items: center;
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[0], $weight: 500 })};
    box-sizing: border-box;
    cursor: pointer;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
`;
