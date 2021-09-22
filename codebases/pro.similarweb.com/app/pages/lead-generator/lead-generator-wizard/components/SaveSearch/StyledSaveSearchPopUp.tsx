import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Title } from "@similarweb/ui-components/dist/title";
import styled from "styled-components";

export const ProModalCustomStyles = {
    content: {
        width: "600px",
        padding: "20px 16px 16px 24px",
    },
};

export const modalWithHiddenOverlayStyles = {
    ...ProModalCustomStyles,
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0)",
    },
};

export const MainBox = styled.div`
    border-radius: 6px;
    background-color: ${colorsPalettes.carbon["0"]};
`;

export const ButtonBox = styled.div`
    display: flex;
    justify-content: flex-end;

    button:last-child {
        margin-left: 8px;
    }
`;

export const CustomTitle = styled.div`
    ${setFont({ $size: 20, $color: colorsPalettes.carbon[500], $weight: 500 })};
    line-height: 1.2;
`;

export const Subtitle: any = styled(Title)`
    ${setFont({ $size: 12, $color: colorsPalettes.carbon[500], $weight: "normal" })};
    line-height: 1.33;
    margin-top: 8px;
    white-space: pre-line;
`;

export const TextFieldContainer = styled.div`
    height: 66px;
    margin: 26px 0 30px 0;
    > div > div {
        text-transform: uppercase;
    }
`;
export const CheckboxContainer = styled.div`
    margin: 0 0 10px 0;
`;
export const LabelCheckboxWrapper = styled.div<{ showRerunCheckbox: boolean }>`
    padding-left: ${({ showRerunCheckbox }) => (showRerunCheckbox ? 29 : 0)}px;
    ${setFont({ $size: 12, $color: colorsPalettes.carbon[300], $weight: "normal" })};
    line-height: 2;
`;
