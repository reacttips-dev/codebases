import styled, { css } from "styled-components";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { colorsPalettes, mixins } from "@similarweb/styles";

interface IDisableable {
    isDisabled?: boolean;
}

export const EndCellContainer = styled.div`
    display: flex;
    > :first-child {
        width: calc(100% - 135px);
    }
`;

export const StyledEnrichButtonText = styled.div<IDisableable>`
    ${(props) =>
        mixins.setFont({
            $size: 10,
            $weight: 700,
            $color: colorsPalettes.carbon[props.isDisabled ? 100 : 200],
        })}
`;

export const StyledEnrichButton = styled(IconButton)<IDisableable>`
    background: ${colorsPalettes.carbon[0]};
    padding: 0 8px;
    border-radius: 4px;
    border: 1px solid ${colorsPalettes.carbon[50]};

    > .SWReactIcons > svg > path {
        fill: ${(props) => colorsPalettes.carbon[props.isDisabled ? 100 : 200]};
    }

    ${(props) =>
        !props.isDisabled &&
        css`
            :hover {
                border: 1px solid ${colorsPalettes.midnight[100]} !important;
            }
        `}
    )
`;
