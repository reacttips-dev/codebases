import { colorsPalettes } from "@similarweb/styles";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { Switcher, IconBoxWithTextSwitchItem } from "@similarweb/ui-components/dist/switcher";
import autobind from "autobind-decorator";
import * as React from "react";
import { Component } from "react";
import * as _ from "lodash";
import styled from "styled-components";
import { ProModal } from "../../Modals/src/ProModal";
import { WithContext } from "../../Workspace/Wizard/src/WithContext";
import { BgImage } from "../../../../app/pages/website-analysis/traffic-sources/ads/components/CreativeUpgradeModal";
import { SWReactIcons } from "@similarweb/icons";

export interface ISelectWorkspaceTrialModalProps {
    isOpen: boolean;
    onCloseClick: () => void;
    createWorkspaceClick: (selectedWorkspace: { name: string; id: number }) => void;
}

export enum ModalStep {
    select = "SELECT",
    create = "CREATE",
}

export const Workspaces = {
    investors: { name: "investors", id: 0 },
    marketing: { name: "marketing", id: 1 },
    sales: { name: "sales", id: 2 },
};

const step1: any = {
    customStyles: {
        content: {
            boxSizing: "content-box",
            width: "450px",
        },
    },
};

const step2: any = {
    customStyles: {
        content: {
            width: "640px",
        },
    },
};

export class SelectWorkspaceTrialModal extends Component<ISelectWorkspaceTrialModalProps, any> {
    private track: any;
    private modalText: {
        SELECT: { title: string; subtitle: string };
        CREATE: { title: string; subtitle: string };
    };
    constructor(props) {
        super(props);
        this.state = {
            modalStep: ModalStep.create,
            selectedWorkspace: Workspaces.marketing,
        };
    }

    public onItemClick = (value) => {
        const selectedWorkspace =
            Workspaces[
                _.findKey(
                    Workspaces,
                    (workspace: { name: string; id: number }) => workspace.id === value,
                )
            ];
        this.setState({
            selectedWorkspace,
            modalStep: ModalStep.create,
        });
    };

    @autobind
    public _createWorkspaceClick() {
        this.props.createWorkspaceClick(this.state.selectedWorkspace);
        this.track(
            `Try workspace  wizard`,
            "click",
            `Third screen/get started/${this.state.selectedWorkspace.name}`,
        );
    }

    public render() {
        const { isOpen } = this.props;
        const { modalStep } = this.state;
        const modalText = {
            SELECT: {
                title: "workspaces.trial.create.modal.step1.title",
                subtitle: "workspaces.trial.create.modal.step1.subtitle",
            },
            CREATE: {
                title: `workspaces.trial.create.modal.step2.${this.state.selectedWorkspace.name}.title`,
                subtitle: `workspaces.trial.create.modal.step2.${this.state.selectedWorkspace.name}.subtitle`,
            },
        };
        const selectedStyle = modalStep === ModalStep.select ? step1 : step2;
        return (
            <WithContext>
                {({ translate, track }) => {
                    this.track = track;
                    return (
                        <ProModal
                            isOpen={isOpen}
                            onCloseClick={this.onCloseClick}
                            {...selectedStyle}
                        >
                            <div>
                                <TitleContainer>
                                    {/*back button currently not in use as long as there is only one option open */}
                                    {/*{modalStep === ModalStep.create && <IconButton type="flat" onClick={this.backToPreviousStep} iconName="arrow-left"/>}*/}
                                    <ModalTitle>{translate(modalText[modalStep].title)}</ModalTitle>
                                </TitleContainer>
                                <ModalSubtitle>
                                    {translate(modalText[modalStep].subtitle)}
                                </ModalSubtitle>
                            </div>
                            {modalStep === ModalStep.select ? (
                                <StyledSwitcher
                                    selectedIndex={this.state.selectedWorkspace.id}
                                    onItemClick={this.onItemClick}
                                >
                                    <StyledIconBoxWithTextSwitchItem customClass={"first"}>
                                        <IconContainer>
                                            <SWReactIcons iconName="investor" />
                                        </IconContainer>
                                        <Text>
                                            {translate(
                                                "workspaces.trial.create.modal.step1.investor",
                                            )}
                                        </Text>
                                    </StyledIconBoxWithTextSwitchItem>
                                    <StyledIconBoxWithTextSwitchItem>
                                        <IconContainer>
                                            <SWReactIcons iconName="marketer" />
                                        </IconContainer>
                                        <Text>
                                            {translate(
                                                "workspaces.trial.create.modal.step1.marketer",
                                            )}
                                        </Text>
                                    </StyledIconBoxWithTextSwitchItem>
                                    <StyledIconBoxWithTextSwitchItem>
                                        <IconContainer>
                                            <SWReactIcons iconName="sales" />
                                        </IconContainer>
                                        <Text>
                                            {translate("workspaces.trial.create.modal.step1.sales")}
                                        </Text>
                                    </StyledIconBoxWithTextSwitchItem>
                                </StyledSwitcher>
                            ) : (
                                <div>
                                    <StyledBgImage
                                        imgSrc={`images/workspace/optIn/marketing_workspace@2x.png`}
                                    />
                                    <Footer>
                                        <Button onClick={this._createWorkspaceClick} type="primary">
                                            <ButtonLabel>
                                                {translate("workspaces.trial.create.button")}
                                            </ButtonLabel>
                                        </Button>
                                    </Footer>
                                </div>
                            )}
                        </ProModal>
                    );
                }}
            </WithContext>
        );
    }

    @autobind
    private backToPreviousStep() {
        this.setState({
            ...this.state,
            modalStep: ModalStep.select,
        });
    }

    private onCloseClick = () => {
        this.track(`Try workspace  wizard`, "close", "Second screen");
        this.props.onCloseClick();
    };
}

export const StyledSwitcher = styled(Switcher)`
    .first {
        margin-left: 0px;
    }
`;
StyledSwitcher.displayName = "StyledSwitcher";

export const Text = styled.div`
    font-weight: 500;
    font-size: 14px;
    color: ${colorsPalettes.carbon["400"]};
    text-transform: capitalize;
`;

export const StyledBgImage = styled(BgImage)`
    background-size: contain;
    height: 320px;
`;
StyledBgImage.displayName = "StyledBgImage";

export const StyledIconBoxWithTextSwitchItem = styled(IconBoxWithTextSwitchItem)`
    border-width: 2px;
    ${Text} {
        position: relative;
        top: -8px;
    }
`;
StyledIconBoxWithTextSwitchItem.displayName = "StyledIconBoxWithTextSwitchItem";

export const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 24px;
`;
Footer.displayName = "Footer";

export const IconContainer = styled.div`
    width: 110px;
    height: 110px;
`;

export const ModalTitle = styled.div.attrs({
    "data-automation": "select-workspace--trial-modal-title",
} as any)`
    font-size: 16px;
    font-weight: 500;
    color: ${colorsPalettes.carbon["500"]};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
ModalTitle.displayName = "ModalTitle";

export const ModalSubtitle = styled.div.attrs({
    "data-automation": "select-workspace--trial-modal-subtitle",
} as any)`
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 12px;
    max-width: 90%;
    color: ${colorsPalettes.carbon["300"]};
    margin-top: 12px;
`;
ModalSubtitle.displayName = "ModalSubtitle";

export const TitleContainer = styled.div`
    display: flex;
    align-items: center;
`;
TitleContainer.displayName = "TitleContainer";
