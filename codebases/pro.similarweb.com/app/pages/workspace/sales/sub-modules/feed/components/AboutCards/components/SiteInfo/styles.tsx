import styled from "styled-components";

export const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 25px 0 0 0;

    div {
        color: #2a3e52;
        font-size: 16px;
        font-weight: 500;
        font-family: Roboto;
    }
`;

export const BadgeContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 0;
    flex-wrap: wrap;
`;

export const Badge = styled.div`
    background-color: #f4f5f6;
    color: #2a3e52;
    padding: 2px 4px;
    font-weight: 400;
    margin-right: 10px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;
export const IconContainer = styled.div`
    color: #a4aeb8;
`;
export const StyledDescription = styled.div`
    padding: 0;
    margin-top: 10px;
`;

export const StyledLink = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 8px 0;
`;
export const CategoryContainer = styled.div`
    text-overflow: ellipsis;
    max-width: 50ch;
    overflow: hidden;
    white-space: nowrap;
    white-space: ${({ isBreak }: { isBreak: boolean }) => (isBreak ? "break-spaces" : "nowrap")};
`;
