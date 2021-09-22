import { SimpleChipItem } from "@similarweb/ui-components/dist/chip";
import { IChipItemProps } from "@similarweb/ui-components/dist/chip/src/items/SimpleChipItem";
import noop from "lodash/noop";
import React from "react";
import styled from "styled-components";

const FullClickSimpleChipItem: React.FunctionComponent<IChipItemProps> = ({
    onCloseItem,
    ...rest
}) => {
    return (
        <span onClick={onCloseItem}>
            <SimpleChipItem onCloseItem={noop} {...rest} />
        </span>
    );
};

export const AddStringChip = styled(FullClickSimpleChipItem)`
    cursor: pointer;

    & svg {
        transform: rotate(45deg);
    }

    .ChipItemText {
        max-width: 200px;
    }
`;
AddStringChip.displayName = "AddStringChip";
