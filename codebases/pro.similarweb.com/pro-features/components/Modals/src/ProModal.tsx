import { SWReactIcons } from "@similarweb/icons";
import noop from "lodash/noop";
import * as React from "react";
import { CSSProperties, FunctionComponent } from "react";
import * as Modal from "react-modal";
import styled from "styled-components";

export interface IProModalCustomStyles {
    overlay?: CSSProperties;
    content?: CSSProperties;
}

export interface IProModal {
    onCloseClick?: () => void;
    onAfterOpen?: () => void;
    shouldCloseOnOverlayClick?: boolean;
    isOpen?: boolean;
    customStyles?: IProModalCustomStyles;
    showCloseIcon?: boolean;
    overlayRef?: (el: any) => any;
    contentRef?: (el: any) => any;
    portalClassName?: string;
    className?: string | { base: string; afterOpen: string; beforeClose: string };
    closeIconColor?: string;
    closeTimeoutMS?: number;
}

export const CloseIconWrapper = styled.div`
    position: absolute;
    top: 18px;
    right: 18px;
    height: 24px;
    width: 24px;
    cursor: pointer;
    svg > path {
        fill: ${(props) => props.color};
    }
`;
CloseIconWrapper.displayName = "CloseIconWrapper";

export const CloseIcon: FunctionComponent<{
    onClick: VoidFunction;
    color?: string;
    className?: string;
}> = ({ onClick, color, className }) => (
    <CloseIconWrapper className={className} onClick={onClick} color={color}>
        <SWReactIcons iconName="clear" />
    </CloseIconWrapper>
);

const defaultStyles: IProModalCustomStyles = {
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
        backgroundColor: "rgba(27, 38, 83, 0.9)",
    },
    content: {
        overflow: "visible",
        position: "relative",
        boxSizing: "border-box",
        flexShrink: 0,
        width: "566px",
        height: "auto",
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto",
        margin: "auto",
        padding: "30px",
        borderRadius: "6px",
        backgroundColor: "#fff",
        boxShadow: "0 12px 30px 0 rgba(0, 0, 0, 0.3)",
    },
};

export class ProModal extends React.PureComponent<IProModal> {
    public static defaultProps = {
        onCloseClick: noop,
        onAfterOpen: noop,
        isOpen: false,
        shouldCloseOnOverlayClick: true,
        customStyles: {
            overlay: {},
            content: {},
        },
        showCloseIcon: true,
        closeTimeoutMS: 150,
    };

    public componentDidMount() {
        if (this.props.isOpen) {
            document.addEventListener("keyup", this.handleKeyUp, { once: true, capture: true });
        }
    }

    private onCloseClick = () => {
        this.props.onCloseClick();
    };

    private handleKeyUp = (e) => {
        if (e.keyCode === 27) {
            this.onCloseClick();
        }
    };

    public render() {
        const {
            isOpen,
            customStyles,
            shouldCloseOnOverlayClick,
            onAfterOpen,
            overlayRef,
            contentRef,
            portalClassName,
            className,
            closeIconColor,
            closeTimeoutMS,
        } = this.props;
        const styles: IProModalCustomStyles = {
            overlay: {
                ...defaultStyles.overlay,
                ...customStyles.overlay,
            },
            content: {
                ...defaultStyles.content,
                ...customStyles.content,
            },
        };

        return (
            <Modal
                isOpen={isOpen}
                style={styles}
                onRequestClose={this.onCloseClick}
                onAfterOpen={onAfterOpen}
                shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
                closeTimeoutMS={closeTimeoutMS}
                ariaHideApp={false}
                overlayRef={overlayRef}
                contentRef={contentRef}
                portalClassName={portalClassName}
                className={className}
            >
                {this.props.children}
                {this.props.showCloseIcon && (
                    <CloseIcon onClick={this.onCloseClick} color={closeIconColor} />
                )}
            </Modal>
        );
    }
}
