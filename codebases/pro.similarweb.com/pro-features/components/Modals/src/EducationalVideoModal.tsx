import { colorsPalettes, rgba } from "@similarweb/styles";
import { Spinner } from "components/Loaders/src/Spinner";
import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { IProMediaPlayerProps, ProMediaPlayer } from "../../MediaPlayer/ProMediaPlayer";
import { CloseIcon, IProModalCustomStyles, ProModal } from "./ProModal";

interface IEducationalVideoModalProps {
    videoConfig?: IProMediaPlayerProps;
    isOpen: boolean;
    onCloseClick: () => void;
    shouldCloseOnOverlayClick?: boolean;
}

const EducationalVideoModalStyles: IProModalCustomStyles = {
    overlay: {
        overflowY: "auto",
        zIndex: 1120,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        right: "auto",
        bottom: "auto",
        padding: "16px",
        backgroundColor: rgba(colorsPalettes.midnight[300], 0.7),
    },
    content: {
        overflow: "visible",
        position: "relative",
        boxSizing: "border-box",
        flexShrink: 0,
        width: "768px",
        height: "432px",
        top: "-68px",
        right: "auto",
        bottom: "auto",
        left: "-4px",
        margin: "auto",
        padding: 0,
        backgroundColor: colorsPalettes.carbon[0],
        border: 0,
        boxShadow: "0 3px 6px 0 rgba(14, 30, 62, 0.08)",
        outline: "none",
    },
};

const StyledCloseIcon = styled(CloseIcon)`
    background-color: ${colorsPalettes.midnight[400]};
    top: -32px;
    right: -40px;
    height: 32px;
    width: 32px;
    z-index: 1120;
    padding: 5px;
    border-radius: 50%;
    box-sizing: border-box;
    transition: background-color ease-in-out 300ms;
    &:hover {
        background-color: ${colorsPalettes.midnight[300]};
    }
    &:active {
        background-color: ${colorsPalettes.midnight[200]};
    }
    @media (max-height: 800px) {
        width: 28px;
        height: 28px;
    }
`;
StyledCloseIcon.displayName = "CloseIcon";

export const PreviewSpinner = styled(Spinner)`
    margin: 0 auto;
    position: relative;
    top: 40px;
    width: 55px;
    height: 55px;
`;

export const EducationalVideoModal: FunctionComponent<IEducationalVideoModalProps> = ({
    isOpen,
    onCloseClick,
    videoConfig,
    shouldCloseOnOverlayClick = false,
}) => {
    const [isLoading, setLoading] = useState(true);

    const onReady = () => {
        setLoading(false);
    };

    const onModalCloseClick = () => {
        setLoading(true);
        onCloseClick();
    };

    return (
        <ProModal
            isOpen={isOpen}
            onCloseClick={onCloseClick}
            customStyles={EducationalVideoModalStyles}
            showCloseIcon={false}
            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
            className={{
                base: "ReactModal__Content",
                afterOpen: "ReactModal__Content--after-open media-player",
                beforeClose: "ReactModal__Content--after-open--before-close",
            }}
        >
            {isLoading && <PreviewSpinner />}
            <StyledCloseIcon onClick={onModalCloseClick} color={colorsPalettes.carbon[200]} />
            <ProMediaPlayer
                url={videoConfig.url}
                videoConfig={videoConfig.videoConfig}
                config={videoConfig.videoParams}
                onReady={onReady}
            />
        </ProModal>
    );
};
