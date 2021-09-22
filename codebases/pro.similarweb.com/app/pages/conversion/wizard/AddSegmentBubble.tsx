import { Bubble } from "@similarweb/ui-components/dist/bubble";
import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";

interface IAddSegmentBubbleProps {
    title: string;
    text: string;
    isInitialOpened: boolean;
    onClose: () => void;
}

const Pin = styled.div`
    position: relative;
    top: 64px;
    border: 1px solid black;
    left: 0;
    opacity: 0;
`;
Pin.displayName = "Pin";

export const AddSegmentBubble: FunctionComponent<IAddSegmentBubbleProps> = ({
    title,
    text,
    isInitialOpened,
    onClose,
}) => {
    const [isClosed, setIsClosed] = useState<boolean>(!isInitialOpened);
    const onCloseClick = () => {
        setIsClosed(true);
        onClose();
    };

    return (
        <Bubble
            isOpen={!isClosed}
            onClose={onCloseClick}
            placement="right"
            cssClass={"Bubble-element add-websites-bubble"}
            title={title}
            text={text}
        >
            <Pin />
        </Bubble>
    );
};
