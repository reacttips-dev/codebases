import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Button } from "@similarweb/ui-components/dist/button";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FunctionComponent } from "react";
import styled, { css } from "styled-components";

import { IProModalCustomStyles, ProModal } from "../../Modals/src/ProModal";
import { InvalidDomainModalArt } from "./InvalidDomainModalArt";

interface IInvalidDomainModalProps {
    isOpen: boolean;
    isCompare: boolean;
    domains: string[];
    onContinue: () => void;
    onChangeWebsiteClick: () => void;
}

const InvalidDomainModalContent = styled.div`
    display: flex;
    flex-direction: column;
    line-height: 25px;
    text-align: center;
    padding: 31px 0 32px;
    align-items: center;
    max-width: 330px;
    margin: 0 auto;
`;

const InvalidDomainModalArtContainer = styled.div`
    margin-bottom: 18px;
`;

const InvalidDomainModalTitle = styled.div`
    ${setFont({ $size: 20, $color: colorsPalettes.carbon[500], $weight: 500 })};
    margin-bottom: 5px;
`;

const InvalidDomainModalSubtitle = styled.span<{ inline?: boolean }>`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    display: ${({ inline }) => (inline ? `initial` : `block`)};
`;

const InvalidDomainModalSubtitleNoMargin = styled.div`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    line-height: 18px;
`;

const ProModalButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 80px;
    margin-top: 24px;
`;

const Link = styled.a`
    text-decoration: none;
    color: ${colorsPalettes.blue[400]};
`;

const proModalStyles: IProModalCustomStyles = {
    content: {
        boxSizing: "border-box",
        width: "510px",
        padding: 0,
    },
};

enum EInvalidDomainModalModes {
    // single invalid domain - no compare
    SINGLE,
    // single invalid domain - in compare mode
    COMPARE,
    // multiple invalid domains (in compare mode)
    MULTIPLE,
}

const getMode = (domains, isCompare): EInvalidDomainModalModes => {
    if (domains.length === 1) {
        if (!isCompare) {
            return EInvalidDomainModalModes.SINGLE;
        } else {
            return EInvalidDomainModalModes.COMPARE;
        }
    } else {
        return EInvalidDomainModalModes.MULTIPLE;
    }
};

const LearnMore: FunctionComponent<{ inline?: boolean }> = ({ inline }, { translate }) => {
    return (
        <InvalidDomainModalSubtitle inline={inline}>
            <Link
                href="https://support.similarweb.com/hc/en-us/articles/360002219177-Reliable-Data-Estimations"
                target="_blank"
            >
                {translate("invalidWebsites.popup.subtitle.link")}
            </Link>
            {` ${translate("invalidWebsites.popup.subtitle.text")}`}
        </InvalidDomainModalSubtitle>
    );
};
LearnMore.contextTypes = {
    translate: PropTypes.func,
};

const getTitle = (domains, isCompare, translate) => {
    switch (getMode(domains, isCompare)) {
        case EInvalidDomainModalModes.SINGLE:
        case EInvalidDomainModalModes.COMPARE:
            return `${domains[0]} ${translate("invalidWebsites.popup.single.title")}`;
            break;
        case EInvalidDomainModalModes.MULTIPLE:
            return translate("invalidWebsites.popup.multiple.title");
            break;
    }
};

const getSubtitle = (domains, isCompare, translate) => {
    switch (getMode(domains, isCompare)) {
        case EInvalidDomainModalModes.SINGLE:
            return <LearnMore inline={false} />;
            break;
        case EInvalidDomainModalModes.COMPARE:
            return (
                <>
                    {translate("invalidWebsites.popup.compare.subtitle.onedomnain")}
                    <LearnMore inline={true} />
                </>
            );
            break;
        case EInvalidDomainModalModes.MULTIPLE:
            return (
                <>
                    {translate("invalidWebsites.popup.compare.subtitle.multidomains", {
                        domains: domains.join(", "),
                    })}
                    <LearnMore inline={false} />
                </>
            );
            break;
    }
};

const getContinueButtonText = (domains, isCompare, translate) => {
    switch (getMode(domains, isCompare)) {
        case EInvalidDomainModalModes.SINGLE:
            return translate("invalidWebsites.popup.cta.change.single");
            break;
        case EInvalidDomainModalModes.COMPARE:
            return translate("invalidWebsites.popup.cta.continue.compare");
            break;
        case EInvalidDomainModalModes.MULTIPLE:
            return translate("invalidWebsites.popup.cta.continue.compare");
            break;
    }
};

const getChangeButtonText = (domains, isCompare, translate) => {
    switch (getMode(domains, isCompare)) {
        case EInvalidDomainModalModes.SINGLE:
            return translate("invalidWebsites.popup.cta.continue");
            break;
        case EInvalidDomainModalModes.COMPARE:
            return translate("invalidWebsites.popup.cta.change.compare");
            break;
        case EInvalidDomainModalModes.MULTIPLE:
            return translate("invalidWebsites.popup.cta.change.multiple");
            break;
    }
};

const getPrimaryButton = (domains, isCompare, translate, onChange, onContinue) => {
    switch (getMode(domains, isCompare)) {
        case EInvalidDomainModalModes.SINGLE:
            return (
                <Button type="primary" onClick={onChange}>
                    {getContinueButtonText(domains, isCompare, translate)}
                </Button>
            );
            break;
        case EInvalidDomainModalModes.COMPARE:
        case EInvalidDomainModalModes.MULTIPLE:
            return (
                <Button type="primary" onClick={onContinue}>
                    {getContinueButtonText(domains, isCompare, translate)}
                </Button>
            );
            break;
    }
};

const getSecondryButton = (domains, isCompare, translate, onChange, onContinue) => {
    switch (getMode(domains, isCompare)) {
        case EInvalidDomainModalModes.SINGLE:
            return (
                <Button type="flat" onClick={onContinue}>
                    {getChangeButtonText(domains, isCompare, translate)}
                </Button>
            );
            break;
        case EInvalidDomainModalModes.COMPARE:
        case EInvalidDomainModalModes.MULTIPLE:
            return (
                <Button type="flat" onClick={onChange}>
                    {getChangeButtonText(domains, isCompare, translate)}
                </Button>
            );
            break;
    }
    return;
};
const InvalidDomainModal: FunctionComponent<IInvalidDomainModalProps> = (
    { isOpen, onContinue, onChangeWebsiteClick, domains, isCompare },
    { translate },
) => {
    return (
        <ProModal
            isOpen={isOpen}
            onCloseClick={onContinue}
            showCloseIcon={false}
            customStyles={proModalStyles}
        >
            <InvalidDomainModalContent>
                <InvalidDomainModalArtContainer>
                    <InvalidDomainModalArt />
                </InvalidDomainModalArtContainer>
                <InvalidDomainModalTitle>
                    {getTitle(domains, isCompare, translate)}
                </InvalidDomainModalTitle>
                <InvalidDomainModalSubtitleNoMargin>
                    {getSubtitle(domains, isCompare, translate)}
                </InvalidDomainModalSubtitleNoMargin>
                <ProModalButtonsContainer>
                    {getPrimaryButton(
                        domains,
                        isCompare,
                        translate,
                        onChangeWebsiteClick,
                        onContinue,
                    )}
                    {getSecondryButton(
                        domains,
                        isCompare,
                        translate,
                        onChangeWebsiteClick,
                        onContinue,
                    )}
                </ProModalButtonsContainer>
            </InvalidDomainModalContent>
        </ProModal>
    );
};
InvalidDomainModal.contextTypes = {
    translate: PropTypes.func,
};
InvalidDomainModal.defaultProps = {
    domains: [],
};

export default InvalidDomainModal;
