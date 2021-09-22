import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import * as propTypes from "prop-types";
import * as React from "react";
import { FunctionComponent, useState } from "react";
import { ButtonGroup } from "../../../ButtonsGroup/src/ButtonsGroup";
import { IProModalCustomStyles, ProModal } from "../../../Modals/src/ProModal";
import {
    ButtonContainer,
    Container,
    LeftButtons,
    RightButtons,
    TabContent,
    Title,
} from "./StyledComponents";

enum EWorkspaceSettingsModalMode {
    EDIT,
    DELETE,
}

interface IWorkspaceSettingsModalProps {
    workspaceOriginalName: string;
    workspaceName: string;
    onSave: (groups, name) => void;
    onCancel: () => void;
    onDeleteWorkspace: () => void;
    isOpen: boolean;
    isLoading: boolean;
    errorMessage?: string;
    arenas: string[];
    initialTab?: number;
    onTabSelect?: (tabIndex) => void;
    onPreDelete?: VoidFunction;
    onCancelDelete?: VoidFunction;
    showKeywordGroups?: boolean;
    showPartnerLists?: boolean;
}

const proModalStyles: IProModalCustomStyles = {
    content: {
        padding: "0 0 0 0",
        border: 0,
        height: 260,
    },
};

export const WorkspaceSettingsModal: FunctionComponent<IWorkspaceSettingsModalProps> = (
    props,
    { translate },
) => {
    const [workspaceName, setWorkspaceName] = useState(props.workspaceOriginalName);
    const [mode, setMode] = useState(EWorkspaceSettingsModalMode.EDIT);

    const {
        onSave,
        onDeleteWorkspace,
        isOpen,
        errorMessage,
        isLoading,
        workspaceOriginalName,
    } = props;

    const onCloseProxy = () => {
        if (mode === EWorkspaceSettingsModalMode.DELETE) {
            props.onCancelDelete();
        }
        setMode(EWorkspaceSettingsModalMode.EDIT);
        props.onCancel();
    };

    const onSaveProxy = () => {
        onSave({}, workspaceName);
    };
    const onDelete = () => {
        props.onPreDelete();
        setMode(EWorkspaceSettingsModalMode.DELETE);
    };

    const workspaceNameChanged = workspaceName && workspaceName !== workspaceOriginalName;

    return (
        <ProModal isOpen={isOpen} onCloseClick={onCloseProxy} customStyles={proModalStyles}>
            <Container>
                <>
                    <Title>{translate("workspace.marketing.delete.title")}</Title>
                    <TabContent>
                        {mode === EWorkspaceSettingsModalMode.EDIT ? (
                            <>
                                <Textfield
                                    error={errorMessage !== ""}
                                    errorMessage={errorMessage}
                                    onChange={setWorkspaceName}
                                    label={translate("workspace.marketing.edit.label")}
                                    defaultValue={workspaceName}
                                />
                            </>
                        ) : (
                            <></>
                        )}
                    </TabContent>
                    <ButtonContainer>
                        <LeftButtons>
                            {mode === EWorkspaceSettingsModalMode.EDIT ? (
                                <Button type="flatWarning" onClick={onDelete}>
                                    {translate("workspace.marketing.edit.button.delete")}
                                </Button>
                            ) : null}
                        </LeftButtons>
                        <RightButtons>
                            <ButtonGroup>
                                {mode === EWorkspaceSettingsModalMode.EDIT ? (
                                    <>
                                        <Button type="flat" onClick={onCloseProxy}>
                                            {translate("workspace.marketing.edit.button.cancel")}
                                        </Button>
                                        <Button
                                            type="primary"
                                            isDisabled={!workspaceNameChanged}
                                            isLoading={isLoading}
                                            onClick={onSaveProxy}
                                        >
                                            {translate("workspace.marketing.edit.button.save")}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button type="flatWarning" onClick={onDeleteWorkspace}>
                                            <ButtonLabel>
                                                {translate(
                                                    "workspace.marketing.edit.button.delete",
                                                )}
                                            </ButtonLabel>
                                        </Button>
                                        <Button type="flat" onClick={onCloseProxy}>
                                            <ButtonLabel>
                                                {translate(
                                                    "workspace.marketing.edit.button.cancel",
                                                )}
                                            </ButtonLabel>
                                        </Button>
                                    </>
                                )}
                            </ButtonGroup>
                        </RightButtons>
                    </ButtonContainer>
                </>
            </Container>
        </ProModal>
    );
};

WorkspaceSettingsModal.contextTypes = {
    translate: propTypes.func,
};
WorkspaceSettingsModal.defaultProps = {
    errorMessage: "",
    isLoading: false,
    initialTab: 0,
    onTabSelect: (tabIndex) => void 0,
    onPreDelete: () => void 0,
    onCancelDelete: () => void 0,
};
WorkspaceSettingsModal.displayName = "WorkspaceSettingsModal";
