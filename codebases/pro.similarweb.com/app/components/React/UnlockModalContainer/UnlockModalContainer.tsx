import { Button, IButtonProps } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { PureComponent } from "react";
import styled from "styled-components";
import UnlockModal from "../UnlockModalProvider/UnlockModalProvider";
import {
    IUnlockConfig,
    UnlockModalConfigType,
} from "../../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../../filters/ngFilters";

export interface IUnlockModalContainerProps {
    buttonConfig?: IButtonProps;
    buttonText: string;
    isLink?: boolean;
    isOpen?: boolean;
    onCloseClick?: () => void;
    location: string;
    modalConfig: IUnlockConfig[UnlockModalConfigType];
    className?: string;
}

interface IUnlockModalContainerState {
    isOpen: boolean;
}

const UnlockLink = styled.a`
    cursor: pointer;
`;

class UnlockModalContainer extends PureComponent<
    IUnlockModalContainerProps,
    IUnlockModalContainerState
> {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    public render() {
        const { isLink, buttonConfig, location, modalConfig, className } = this.props;
        const label = i18nFilter()(this.props.buttonText);

        return (
            <div>
                {!isLink ? (
                    <Button {...buttonConfig} className={className} onClick={this.openModal}>
                        {label}
                    </Button>
                ) : (
                    <UnlockLink onClick={this.openModal} className={className}>
                        {label}
                    </UnlockLink>
                )}
                <UnlockModal
                    isOpen={this.state.isOpen}
                    onCloseClick={this.closeModal}
                    location={location}
                    {...modalConfig}
                />
            </div>
        );
    }

    private openModal = () => {
        const { buttonConfig } = this.props;
        if (buttonConfig && buttonConfig.onClick) {
            buttonConfig.onClick();
        }

        this.setState({ isOpen: true });
    };

    private closeModal = () => {
        if (this.props.onCloseClick) {
            this.props.onCloseClick();
        }

        this.setState({ isOpen: false });
    };
}

SWReactRootComponent(UnlockModalContainer, "UnlockModalContainer");

export default UnlockModalContainer;
