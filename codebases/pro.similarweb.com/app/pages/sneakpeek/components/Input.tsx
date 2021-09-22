import react from "react";
import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";

const Input = styled.input.attrs({
    type: "text",
})`
    && {
        width: ${(props) => props.width || "216px"};
        padding: 5px 16px;
        background-color: ${colorsPalettes.carbon[0]};
        font-family: "Roboto", Tahoma, sans-serif;
        font-size: 14px;
        color: #536275;
        border: 1px solid ${colorsPalettes.midnight[50]};
        border-radius: 3px;
        letter-spacing: 0.2px;
        text-align: left;
        outline: 0;
        transition: background-color ease 300ms, border ease 300ms, box-shadow ease 300ms;
        height: 40px;
        box-sizing: border-box;
        vertical-align: middle;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        margin: 0;
        &::placeholder {
            color: ${colorsPalettes.carbon[200]};
            font-size: 14px;
        }
        &:focus {
            box-shadow: 0 3px 5px 0 rgba(42, 62, 82, 0.12) !important;
            border: solid 1px #d1d6dd;
        }
        &:disabled {
            background-color: rgba(234, 237, 240, 0.8);
            border: solid 1px rgba(209, 214, 221, 0.8);
            color: rgba(42, 62, 82, 0.35);
            &::placeholder {
                color: rgba(42, 62, 82, 0.35);
            }
        }
        &.SearchInput--error {
            background-color: #ffffff;
            box-shadow: 0 3px 5px 0 rgba(152, 43, 43, 0.12) !important;
            border: solid 2px #f3a196;
        }
    }
`;

export default Input;
