/* eslint-disable @typescript-eslint/explicit-function-return-type */
import styled from "styled-components";
import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { ItemContainer, TextContainer } from "./EmptyGroupItemStyles";
import { IEmptyGroupItemProps } from "./EmptyGroupItemTypes";

export const EmptyGroupItem = (props: IEmptyGroupItemProps) => {
    const { text, buttonText, onButtonClick } = props;
    return (
        <ItemContainer>
            <TextContainer>{text}</TextContainer>
            <Button type="flat" onClick={onButtonClick}>
                {buttonText}
            </Button>
        </ItemContainer>
    );
};
