import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { Button } from "@similarweb/ui-components/dist/button";
import { IProModalCustomStyles, ProModal } from "../../../components/Modals/src/ProModal";
import { FlexRow } from "../../StyledFlex/src/StyledFlex";

const UnlockCountryModalContent = styled.div`
    font-family: Roboto;
    height: 140px;
`;
UnlockCountryModalContent.displayName = "UnlockCountryModalContent";

const UnlockCountryModalTitle = styled.div`
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #2a3e52;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
UnlockCountryModalTitle.displayName = "UnlockCountryModalTitle";

const UnlockCountryModalSubtitle = styled.div`
    color: rgba(42, 62, 82, 0.8);
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 12px;
    max-width: 90%;
    color: rgba(42, 62, 82, 0.8);
`;
UnlockCountryModalSubtitle.displayName = "UnlockCountryModalSubtitle";

export const UnlockCountryModalFooter = styled.div`
    display: flex;
    justify-content: space-between;
    button {
        margin-left: 8px;
    }
    > button {
        margin-left: -16px;
    }
`;
UnlockCountryModalFooter.displayName = "UnlockCountryModalFooter";

export const UnlockCountryModalLink = styled.a`
  textDecoration: none'
`;

interface IUnlockCountryModalProps {
    isOpen: boolean;
    onClickAction: () => void;
    countryName: string;
    fallbackName: string;
    fallbackLink: string;
    translate: (string, any?) => string;
    titleText?: string;
    subtitleText?: string;
    closeText?: string;
    fallbackText?: string;
}

const proModalStyles: IProModalCustomStyles = {
    content: {
        boxSizing: "content-box",
        width: "590px",
    },
};

const UnlockCountryModal: StatelessComponent<IUnlockCountryModalProps> = ({
    isOpen,
    onClickAction,
    countryName,
    fallbackName,
    fallbackLink,
    translate,
    titleText,
    subtitleText,
    closeText,
    fallbackText,
    children,
}) => (
    <ProModal isOpen={isOpen} onCloseClick={onClickAction} customStyles={proModalStyles}>
        <UnlockCountryModalContent>
            <UnlockCountryModalTitle>{translate(titleText)}</UnlockCountryModalTitle>
            <UnlockCountryModalSubtitle>
                {translate(subtitleText, {
                    country_name: countryName,
                    fallback_name: fallbackName,
                })}
            </UnlockCountryModalSubtitle>
        </UnlockCountryModalContent>
        <UnlockCountryModalFooter>
            <Button type="flat" onClick={onClickAction}>
                {translate(closeText)}
            </Button>
            <FlexRow>
                <UnlockCountryModalLink href={fallbackLink}>
                    <Button type="flat" onClick={onClickAction}>
                        {translate(fallbackText)}
                    </Button>
                </UnlockCountryModalLink>
                <UnlockCountryModalLink onClick={onClickAction}>{children}</UnlockCountryModalLink>
            </FlexRow>
        </UnlockCountryModalFooter>
    </ProModal>
);

UnlockCountryModal.defaultProps = {
    titleText: "modal.unlock_country.title",
    subtitleText: "modal.unlock_country.subtitle",
    closeText: "modal.unlock_country.close",
    fallbackText: "modal.unlock_country.fallback",
};

export default UnlockCountryModal;
