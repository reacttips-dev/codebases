import styled from "styled-components";
export const InsightHeaderStyled = styled.span<{ color: string }>`
    ${({ color }) => `color:${color}`}
    padding-left: 4px;
`;
