import * as React from "react";
import { StatelessComponent } from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { WorkspaceEmptyState } from "../../../../components/Workspace/EmptyState/src/WorkspaceEmptyState";
import { CommonEmptyStateWrapper } from "./StyledComponents";
import WithTranslation from "../../../../components/WithTranslation/src/WithTranslation";
import { SWReactIcons } from "@similarweb/icons";

const translations = {
    investors: (translate) => ({
        findTitle: translate("workspace.investors.empty_state.find.title"),
        findSubtitle: translate("workspace.investors.empty_state.find.subtitle"),
        findButtonLabel: translate("workspace.investors.empty_state.find.button"),
        uploadTitle: translate("workspace.investors.empty_state.upload.title"),
        uploadSubtitle: translate("workspace.investors.empty_state.upload.subtitle"),
        uploadButtonLabel: translate("workspace.investors.empty_state.upload.button"),
    }),
    sales: (translate) => ({
        findTitle: translate("workspace.sales.empty_state.find.title"),
        findSubtitle: translate("workspace.sales.empty_state.find.subtitle"),
        findButtonLabel: translate("workspace.sales.empty_state.find.button"),
        uploadTitle: translate("workspace.sales.empty_state.upload.title"),
        uploadSubtitle: translate("workspace.sales.empty_state.upload.subtitle"),
        uploadButtonLabel: translate("workspace.sales.empty_state.upload.button"),
    }),
};

interface ICommonEmptyStateProps {
    workspaceType: string;
    findIllustration?: any;
    onFindClick: () => void;
    uploadIllustration?: any;
    onUploadClick: () => void;
    enableFindOpportunities?: boolean;
}

export const CommonEmptyState: StatelessComponent<ICommonEmptyStateProps> = (props) => (
    <WithTranslation>
        {(translate) => {
            const {
                findTitle,
                findSubtitle,
                findButtonLabel,
                uploadTitle,
                uploadSubtitle,
                uploadButtonLabel,
            } = translations[props.workspaceType](translate);
            return (
                <CommonEmptyStateWrapper>
                    <WorkspaceEmptyState
                        title={uploadTitle}
                        subTitle={uploadSubtitle}
                        image={props.uploadIllustration}
                        button={
                            <Button
                                dataAutomation="workspace-empty-state-upload-button"
                                onClick={props.onUploadClick}
                            >
                                {uploadButtonLabel}
                            </Button>
                        }
                    />
                    {props.enableFindOpportunities && (
                        <WorkspaceEmptyState
                            title={findTitle}
                            subTitle={findSubtitle}
                            image={props.findIllustration}
                            button={
                                <Button
                                    type="outlined"
                                    dataAutomation="workspace-empty-state-find-button"
                                    onClick={props.onFindClick}
                                >
                                    {findButtonLabel}
                                </Button>
                            }
                        />
                    )}
                </CommonEmptyStateWrapper>
            );
        }}
    </WithTranslation>
);

CommonEmptyState.displayName = "CommonEmptyState";
CommonEmptyState.defaultProps = {
    findIllustration: <SWReactIcons iconName="workspace-empty-state-illustration.find" />,
    uploadIllustration: <SWReactIcons iconName="workspace-empty-state-illustration.upload" />,
    enableFindOpportunities: true,
};
