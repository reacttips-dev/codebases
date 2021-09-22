import { colorsPalettes } from "@similarweb/styles";
import { ListItemCountry, ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import * as PropTypes from "prop-types";
import * as React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { CreationWizard } from "../../../../../pages/feed/components/creation-wizard";
import { ISite } from "../types";
import { contextTypes, WithContext } from "../WithContext";
import { BackButton, WizardContext } from "../Wizard";
import { Container, Subtitle, Title } from "./StyledComponents";

export const ContainerExtended = styled(Container)`
    .CreationWizard {
        width: 100%;
    }
    .MultipleSelection-autocomplete {
        margin-bottom: 0;
        &.MultipleSelection-autocomplete--empty {
            max-height: 45px;
        }
        z-index: 3;
    }
    .MultipleSelection-suggestions {
        box-sizing: border-box;
    }
    .MultipleSelection-suggestions-title {
        width: 130px;
        height: 16px;
        font-family: Roboto;
        font-size: 12px;
        letter-spacing: 0.15px;
        color: #8a95a0;
        margin-top: 16px;
        padding: 0 0 6px 0 !important;
    }
    .MultipleSelection-suggestions-list-content .WebsiteListItem {
        padding: 0 20px 0 10px;
    }
    .CreationWizard-footer {
        padding: 0;
    }
    .CreationWizard-body {
        min-height: 90px;
        margin-bottom: 35px;
    }
    .MultipleSelection-suggestions-list {
        border-bottom: 1px solid ${colorsPalettes.midnight[50]};
    }
    .ChipItemText {
        max-width: 160px;
    }
`;
ContainerExtended.displayName = "ContainerExtended";

const Content = styled.div`
    width: 542px;
    margin-top: 16px;
`;
Content.displayName = "Content";

const SelectCompetitorTitle = styled(Title)`
    line-height: 1.2;
`;

const SelectCompetitorsSubtitle = styled(Subtitle)`
    margin-top: 4px;
    line-height: 1.33;
    height: 16px;
`;

const SubDomainsText = styled(Subtitle)`
    width: 150px;
    height: 24px;
    font-family: Roboto;
    font-size: 12px;
    line-height: 2;
    color: rgba(42, 62, 82, 0.6);
    margin-top: 0 !important;
`;
SubDomainsText.displayName = "SubDomainsText";

const ButtonContainer = styled.div`
    margin-top: 22px;
    text-align: right;
    text-transform: capitalize;
    position: absolute;
    bottom: 80px;
    right: 120px;
`;
ButtonContainer.displayName = "ButtonContainer";

export const ReadOnly = styled.div`
    user-select: none;
    pointer-events: none;
    cursor: default;
`;

const SelectedSiteContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
SelectedSiteContainer.displayName = "SelectedSiteContainer";

const TrialBackButton: any = styled(BackButton)`
    padding-left: 0;
    transform: translateY(-100%);
    position: absolute;
`;

export interface IChooseMyCompetitorsProps {
    title?: string;
    subtitle?: string;
    submitButtonText?: string;
    isLoading?: boolean;
    showBackButton?: boolean;
    enableSmallSiteNotification?: boolean;
    competitors: ISite[];

    getSuggestions();

    onCompetitorsUpdate(competitor: ISite): void;

    getAutoComplete(query: string): Promise<ISite[]>;

    onAddCompetitor?();

    onRemoveCompetitor?();

    onSaveButtonClick?();

    removeWorkspace?();
}

export interface ISimilarSites {
    title?: string;
    items: ISite[];
}

export const ReadOnlyListItemWebsite = ({ text, image }) => (
    <ReadOnly>
        <ListItemWebsite img={image} text={text} onClick={() => null} isActive={false} />
    </ReadOnly>
);

export const ReadOnlyListItemCountry = ({ text, countryCode }) => (
    <ReadOnly>
        <ListItemCountry countryCode={countryCode} text={text} />
    </ReadOnly>
);

function getPlaceHolderText(selectedItems, maxItems) {
    if (!selectedItems || !selectedItems.length) {
        return "workspaces.marketing.competitors.placeholder.empty";
    } else if (selectedItems.length < maxItems) {
        return "workspaces.marketing.competitors.placeholder.addmore";
    }
    return "dashboards.wizard.template_config.Website.placeholderFull";
}

export class SelectCompetitors extends React.Component<IChooseMyCompetitorsProps> {
    static defaultProps = {
        title: "workspaces.marketing.wizard.select_competitors",
        subtitle: "workspaces.marketing.wizard.select_competitors.sub_title",
        submitButtonText: "workspaces.marketing.wizard.select_competitors.button",
    };

    render() {
        const { translate, onClickBack } = this.context;
        const {
            getSuggestions,
            getAutoComplete,
            onCompetitorsUpdate,
            competitors,
            onSaveButtonClick,
            title,
            subtitle,
            submitButtonText,
            isLoading,
            removeWorkspace,
            enableSmallSiteNotification,
            showBackButton,
        } = this.props;

        return (
            <WithContext>
                {({ track }) => (
                    <WizardContext>
                        {({ goToStep }) => (
                            <ContainerExtended>
                                <SelectCompetitorTitle>{translate(title)}</SelectCompetitorTitle>
                                <SelectCompetitorsSubtitle>
                                    {translate(subtitle)}
                                </SelectCompetitorsSubtitle>
                                <Content>
                                    <div>
                                        <SubDomainsText>
                                            {translate(
                                                "workspaces.marketing.wizard.select_competitors.sub_domains_text",
                                            )}
                                        </SubDomainsText>
                                        <CreationWizard
                                            suggestedWebsites={getSuggestions()}
                                            getAutoComplete={getAutoComplete}
                                            minSelectedItems={1}
                                            initialScrollHeight={220}
                                            showSuggestionsInAutoComplete={false}
                                            onSelectedItemsChanged={onCompetitorsUpdate}
                                            selectedItems={competitors}
                                            onSaveButtonClick={() => {
                                                typeof onSaveButtonClick === "function"
                                                    ? onSaveButtonClick()
                                                    : goToStep(2);
                                                track(
                                                    "wizard",
                                                    "click",
                                                    `marketing wizard/add competitors/move next step/${competitors.length}`,
                                                );
                                                track(
                                                    "wizard",
                                                    "click",
                                                    `marketing wizard/competitors/${competitors.map(
                                                        (item) => item.name,
                                                    )}`,
                                                );
                                            }}
                                            maxItems={4}
                                            getPlaceHolderText={getPlaceHolderText}
                                            onItemAdded={this.onItemAdded}
                                            onItemDeleted={this.onItemDeleted}
                                            isLoading={isLoading}
                                            buttonText={translate(submitButtonText)}
                                            trackDisabledButton={this.trackDisabledButton}
                                            enableSmallSiteNotification={
                                                enableSmallSiteNotification
                                            }
                                            buttonDisabled={false}
                                        />
                                        {showBackButton && (
                                            <TrialBackButton
                                                visible={true}
                                                backButtonText={
                                                    "workspaces.marketing.wizard.goback"
                                                }
                                                onClickBack={onClickBack}
                                            />
                                        )}
                                    </div>
                                </Content>
                            </ContainerExtended>
                        )}
                    </WizardContext>
                )}
            </WithContext>
        );
    }

    onItemAdded = (domain, source) => {
        const { track } = this.context;
        track(
            "wizard",
            "click",
            `marketing wizard/add competitor ${
                source === "suggested" ? "suggestion" : "manually"
            }/${domain}`,
        );
    };

    onItemDeleted = (name) => {
        const { track } = this.context;
        track("wizard", "click", `marketing wizard/remove competitor/${name}`);
    };

    static contextTypes = {
        ...contextTypes,
        goToStep: PropTypes.func.isRequired,
        onClickBack: PropTypes.func,
    };
    private trackDisabledButton = () => {
        if (this.props.competitors.length < 1) {
            TrackWithGuidService.trackWithGuid(
                "workspace_marketing_wizard_addCompetitors",
                "submit-client-error",
            );
        }
    };
}
