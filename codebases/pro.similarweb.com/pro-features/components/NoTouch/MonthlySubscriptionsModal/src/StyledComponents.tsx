import styled from "styled-components";

export const StyledHeader = styled.div`
    box-sizing: border-box;
    min-height: 266px;
    background-color: #f5f9fd;
    padding: 30px;
    background-image: linear-gradient(to bottom, transparent 89%, rgba(27, 70, 145, 0.17) 100%);
    img {
        display: block;
        max-width: 100%;
        width: 560px;
        height: auto;
        margin: 0 auto;
    }
`;

export const StyledContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 16.5%;
    text-align: center;
    .Button {
        min-width: 174px;
    }
`;

export const StyledTitle = styled.h4`
    margin: 0 0 8px;
    font-size: 24px;
    font-weight: 500;
    color: #2a3e52;
    line-height: 1.17;
`;

export const StyledSubtitle = styled.p`
    margin: 0 0 32px;
    font-size: 14px;
    color: rgba(42, 62, 82, 0.8);
    line-height: 1.43;
`;
