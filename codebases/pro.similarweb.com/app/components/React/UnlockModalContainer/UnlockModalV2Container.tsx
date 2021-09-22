import { Button, IButtonProps } from "@similarweb/ui-components/dist/button";
import { FC, useCallback } from "react";
import { openUnlockModalV2, HookV2Type } from "services/ModalService";
import styled from "styled-components";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../../filters/ngFilters";

export interface IUnlockModalV2Container {
    buttonConfig?: IButtonProps;
    buttonText?: string;
    className?: string;
    isLink?: boolean;
    modalConfig: {
        featureKey: string;
        trackingSubName?: HookV2Type;
    };
}

const UnlockLink = styled.a`
    cursor: pointer;
`;

const UnlockModalV2Container: FC<IUnlockModalV2Container> = ({
    isLink,
    className,
    buttonText,
    buttonConfig,
    modalConfig: { featureKey, trackingSubName },
}) => {
    const label = i18nFilter()(buttonText);
    const openModal = useCallback(() => {
        openUnlockModalV2(featureKey, trackingSubName);
    }, [featureKey, trackingSubName]);

    return (
        <div>
            {!isLink ? (
                <Button {...buttonConfig} className={className} onClick={openModal}>
                    {label}
                </Button>
            ) : (
                <UnlockLink onClick={openModal} className={className}>
                    {label}
                </UnlockLink>
            )}
        </div>
    );
};

SWReactRootComponent(UnlockModalV2Container, "UnlockModalV2Container");

export default UnlockModalV2Container;
