import styled from "styled-components";

export const WizardCompleteImage = styled.div<{ imageUrl: string }>`
    background: url(${({ imageUrl }) => imageUrl}) top no-repeat;
    background-size: 140px 140px;
    width: 150px;
    height: 150px;
    margin-bottom: 15px;
`;

export const OveviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 54px;
    box-sizing: border-box;
    width: 100%;
`;
