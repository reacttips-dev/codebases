import { colorsPalettes } from "@similarweb/styles";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import LocationService from "components/Modals/src/UnlockModal/LocationService";
import { CircularLoader } from "components/React/CircularLoader";
import I18n from "components/React/Filters/I18n";
import React, { useState } from "react";
import { FunctionComponent } from "react";
import { openUnlockModal } from "services/ModalService";
import styled from "styled-components";
import {
    GroupCreationDropdownItem,
    Icon,
} from "../../../../../components/GroupCreationDropdown/src/GroupCreationDropdownItem";

interface INewLeadsCreationDropdownProps {
    button: any;
    onAddLeadsManually: any;
    onAddFromGenerator: any;
    keys: ILeadCreationDropdownKeys;
    isGeneratorLimited?: boolean;
    checkIsGeneratorLocked?: () => Promise<boolean>;
}
interface ILeadCreationDropdownKeys {
    addManuallyTitle: string;
    addManuallyDescription: string;
    addFromGeneratorTitle: string;
    addFromGeneratorDescription: string;
    addFromGeneratorNote: string;
    addFromGeneratorButton: string;
}

interface IAddFromGeneratorProps {
    isGeneratorLocked: boolean;
    onAddFromGeneratorClick: VoidFunction;
    keys: ILeadCreationDropdownKeys;
}

export const DropdownItem = styled(GroupCreationDropdownItem)`
    ${Icon} svg path {
        fill: #aab2ba;
    }

    &.isLocked {
        cursor: default;

        &:hover {
            background-color: ${colorsPalettes.carbon[0]};
        }
    }
`;

const StyledLoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
`;

const StyledLockedText = styled.div`
    opacity: 0.5;
`;

const StyledLockedItemNote = styled.div`
    margin-top: 16px;
    color: ${colorsPalettes.carbon[500]};
`;

const StyledLockedItemButton = styled(Button)`
    padding: 4px 20px;
    margin-top: 16px;

    ${ButtonLabel} {
        font-size: 11px;
    }
`;

export const AddFromGenerator: FunctionComponent<IAddFromGeneratorProps> = (props) => {
    const { isGeneratorLocked, onAddFromGeneratorClick, keys } = props;
    return isGeneratorLocked ? (
        <DropdownItem
            iconName="locked"
            className="isLocked"
            title={
                <StyledLockedText>
                    <I18n>{keys.addFromGeneratorTitle}</I18n>
                </StyledLockedText>
            }
            description={
                <>
                    <StyledLockedText>
                        <I18n>{keys.addFromGeneratorDescription}</I18n>
                    </StyledLockedText>
                    <StyledLockedItemNote>
                        <I18n>{keys.addFromGeneratorNote}</I18n>
                    </StyledLockedItemNote>
                    <StyledLockedItemButton
                        type="trial"
                        height={24}
                        label={<I18n>{keys.addFromGeneratorButton}</I18n>}
                        onClick={() => {
                            openUnlockModal(
                                {
                                    modal: "SourceOpportunities",
                                    slide: "SourceOpportunities",
                                },
                                `${LocationService.getCurrentLocation()}/TrialBanner`,
                            );
                        }}
                    />
                </>
            }
        />
    ) : (
        <DropdownItem
            preventDefault={true}
            onClick={onAddFromGeneratorClick}
            iconName={"lead-generator"}
            title={<I18n>{keys.addFromGeneratorTitle}</I18n>}
            description={<I18n>{keys.addFromGeneratorDescription}</I18n>}
        />
    );
};

const NewLeadsCreationDropdown: FunctionComponent<INewLeadsCreationDropdownProps> = ({
    button,
    onAddFromGenerator,
    onAddLeadsManually,
    keys,
    isGeneratorLimited,
    checkIsGeneratorLocked,
}) => {
    const [isGeneratorLocked, setGeneratorLocked] = useState(false);
    const [isGeneratorLoading, setGeneratorLoading] = useState(true);

    const handleOpenDropdown = async (isOpen) => {
        if (isOpen && isGeneratorLimited && checkIsGeneratorLocked) {
            if (isGeneratorLimited && isGeneratorLocked !== true) {
                checkIsGeneratorLocked().then((value) => {
                    if (isGeneratorLocked !== value) {
                        setGeneratorLocked(value);
                    }
                    setGeneratorLoading(false);
                });
            } else {
                setGeneratorLoading(false);
            }
        } else {
            setGeneratorLoading(false);
        }
    };

    return (
        <div>
            <Dropdown
                onToggle={handleOpenDropdown}
                width={256}
                cssClassContainer={`DropdownContent-container Popup-content--pro-dropdown`}
            >
                {button}
                <DropdownItem
                    preventDefault={true}
                    onClick={onAddLeadsManually}
                    iconName="add"
                    title={<I18n>{keys.addManuallyTitle}</I18n>}
                    description={<I18n>{keys.addManuallyDescription}</I18n>}
                />
                {isGeneratorLoading ? (
                    <StyledLoaderWrapper>
                        <CircularLoader
                            options={{
                                svg: {
                                    cx: "50%",
                                    cy: "50%",
                                    r: "14",
                                    stroke: "#dedede",
                                    strokeWidth: "3",
                                },
                                style: {
                                    width: "36px",
                                    height: "36px",
                                },
                            }}
                        />
                    </StyledLoaderWrapper>
                ) : (
                    <AddFromGenerator
                        isGeneratorLocked={isGeneratorLocked}
                        onAddFromGeneratorClick={onAddFromGenerator}
                        keys={keys}
                    />
                )}
            </Dropdown>
        </div>
    );
};
NewLeadsCreationDropdown.displayName = "NewLeadsCreationDropdown";
export default NewLeadsCreationDropdown;
