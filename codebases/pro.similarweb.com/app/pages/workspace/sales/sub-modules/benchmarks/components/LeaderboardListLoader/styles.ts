import styled from "styled-components";

export const StyledListLoader = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;

    & > svg {
        display: block;

        &:not(:last-child) {
            margin-bottom: 17px;
        }
    }
`;
