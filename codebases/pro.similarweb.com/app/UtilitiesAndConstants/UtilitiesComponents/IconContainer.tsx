import styled from "styled-components";
import { TCssUnits } from "UtilitiesAndConstants/types/cssTypes";

export const IconContainer = styled.div<{ size: number; units?: TCssUnits }>`
    .SWReactIcons {
        ${({ size, units = "px" }) => {
            const dimension = size + units;
            return `
            width: ${dimension};
            height: ${dimension};
        `;
        }}
`;
