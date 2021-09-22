import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const ModalSection = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: row;
`;

export const ModalHeader = styled(ModalSection)`
    justify-content: flex-start;
    align-items: center;

    span {
        font-size: 24px;
        font-weight: 500;
        color: ${colorsPalettes.carbon[400]};
    }
`;

export const ModalBody = styled(ModalSection)`
    justify-content: center;
    padding-top: 0px;
`;

export const ModalFooter = styled(ModalSection)`
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid ${colorsPalettes.carbon[50]};
`;

export const ButtonContainer = styled.div`
    margin-left: 24px;
`;
