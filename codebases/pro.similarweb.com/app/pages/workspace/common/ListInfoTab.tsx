import * as React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { Label, Textfield } from "@similarweb/ui-components/dist/textfield";
import { i18nFilter } from "../../../filters/ngFilters";
import Alert from "../../sneakpeek/components/Alert";
import { AlertBoxContainer, DangerZoneContent, TextFieldContainer } from "./styles";

export const ListInfoTab = ({
    namePlaceHolder,
    listName,
    error,
    mode,
    onDelete,
    onListNameChanged,
}) => {
    return (
        <>
            <TextFieldContainer>
                <Textfield
                    label={i18nFilter()("workspaces.investors.opportunity-lists.edit.title")}
                    defaultValue={listName}
                    onChange={onListNameChanged}
                    error={error}
                    errorMessage={i18nFilter()(
                        "workspaces.investors.opportunity-lists.edit.title.error",
                    )}
                    placeholder={namePlaceHolder}
                    maxLength={100}
                    dataAutomation="list-settings-modal-title-text-field"
                />
            </TextFieldContainer>
            {mode === "edit" && (
                <AlertBoxContainer>
                    <Label>Danger zone</Label>
                    <Alert
                        text={
                            <DangerZoneContent>
                                <span>
                                    {i18nFilter()(
                                        "workspaces.investors.opportunity-lists.delete.text",
                                    )}
                                </span>
                                <Button
                                    onClick={onDelete}
                                    type="flatWarning"
                                    dataAutomation="list-settings-modal-delete-button"
                                    buttonHtmlType="button"
                                >
                                    {i18nFilter()(
                                        "workspaces.investors.opportunity-lists.delete.button",
                                    )}
                                </Button>
                            </DangerZoneContent>
                        }
                    />
                </AlertBoxContainer>
            )}
        </>
    );
};
