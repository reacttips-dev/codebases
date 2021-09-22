import styled from "styled-components";

export const StyledFadeIn = styled.div`
    animation: fadeIn cubic-bezier(0.25, 0.46, 0.45, 0.94) 500ms forwards;
    opacity: 0;

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
`;
