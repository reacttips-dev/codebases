import * as React from "react";
import styled from "styled-components";

import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import { AutosizeInput, IAutosizeInputProps } from "@similarweb/ui-components/dist/autosize-input";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { DotsLoader, FakeInput } from "@similarweb/ui-components/dist/search-input";
import { Button } from "@similarweb/ui-components/dist/button";
import { contextTypes } from "../WithContext";
import * as PropTypes from "prop-types";
import { CreationWizard } from "../../../../../pages/feed/components/creation-wizard";
import { ISite } from "../types";
import { CountryFilter } from "../../../../../../app/components/filters-bar/country-filter/CountryFilter";
import { ICountryObject } from "../../../../../../app/services/CountryService";
import { IArena } from "../../../../../../app/services/marketingWorkspaceApiService";
import { Container, CountryContainerStyled, FakeInputContainer, Label } from "./StyledComponents";
import { DeleteConfirmation } from "../DeleteConfirmation";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

export const ContainerExtended = styled(Container)`
    width: 700px;
    min-height: 582px;
    padding: 40px 32px 32px 40px;
    box-sizing: border-box;
    color: #1b2653;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    text-align: left;

    .CreationWizard {
        width: 100%;
    }
    .MultipleSelection-autocomplete {
        margin-bottom: 0;
        padding: 0;
        &.MultipleSelection-autocomplete--empty {
            max-height: 45px;
        }
        z-index: 3;
    }
    .MultipleSelection-suggestions {
        box-sizing: border-box;
        margin-left: 8px;
    }
    .MultipleSelection-suggestions-title {
        margin-top: 25px;
    }
    .MultipleSelection-suggestions-list-content .WebsiteListItem {
        padding: 0 20px 0 10px;
    }
    .CreationWizard-footer {
        padding: 0;
    }
    .CreationWizard-body {
        min-height: 90px;
        margin-bottom: 20px;
    }
    .MultipleSelection-suggestions-list {
        border-bottom: 1px solid ${colorsPalettes.midnight[50]};
    }
`;
Container.displayName = "Container";

const Content = styled.div`
    width: 542px;
    margin-top: 25px;
`;
Content.displayName = "Content";

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

const AutosizeInputStyled = styled(AutosizeInput)<IAutosizeInputProps>`
    width: auto;
    > div {
        max-width: 100%;
    }
`;

const AutocompleteStyled = styled(Autocomplete)<any>`
    z-index: 4;
`;

const DeleteButton = styled(Button)`
    transform: translateY(-100%);
    position: absolute;
`;

export interface IChooseMyCompetitorsProps {
    arena: IArena;
    title?: string;
    subtitle?: string;
    isLoading?: boolean;
    isDeletingArena?: boolean;
    selectedSite: ISite;
    competitors: ISite[];
    selectedCountry: ICountryObject;
    availableCountries: ICountryObject[];
    onCountryChange: (country) => void;
    onSave: (name) => void;
    onDeleteArena?: () => void;
    onClearMainSite?: () => void;
    subscriptionComponent?: React.ReactNode;

    getSuggestions();

    onCompetitorsUpdate(competitor: ISite): void;

    getAutoComplete(query: string): Promise<ISite[]>;

    onAddCompetitor?();

    onRemoveCompetitor?();

    onSaveButtonClick?();

    removeWorkspace?();

    getWebsitesSuggestions(query: string): Promise<ISite[]>;

    onSelectMainSite(site: ISite);
}

function getPlaceHolderText(selectedItems, maxItems) {
    if (!selectedItems || !selectedItems.length) {
        return "workspaces.marketing.competitors.placeholder.empty";
    } else if (selectedItems.length < maxItems) {
        return "workspaces.marketing.competitors.placeholder.addmore";
    }
    return "dashboards.wizard.template_config.Website.placeholderFull";
}

interface IState {
    editMainDomain: boolean;
    arenaName: string;
    isLoading: boolean;
    showDeleteConfirmation: boolean;
}

export class EditArena extends React.Component<IChooseMyCompetitorsProps, IState> {
    static defaultProps = {
        title: "workspaces.marketing.wizard.select_competitors",
        subtitle: "workspaces.marketing.wizard.change_select_competitors",
        isDeletingArena: false,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            editMainDomain: false,
            arenaName: props.arena.friendlyName,
            isLoading: false,
            showDeleteConfirmation: false,
        };
        // call onSelectMainSite with the selected site in order to get it's suggestions
        const { name, image } = this.props.selectedSite;
        this.props.onSelectMainSite({ name, image });
    }

    render() {
        const { translate } = this.context;
        const buttonText = translate("workspaces.marketing.wizard.updatearena.button");
        const {
            getSuggestions,
            getAutoComplete,
            onCompetitorsUpdate,
            competitors,
            selectedSite,
            onSaveButtonClick,
            title,
            subtitle,
            isLoading,
            removeWorkspace,
            selectedCountry,
        } = this.props;
        const { editMainDomain } = this.state;
        return (
            <ContainerExtended>
                <AutosizeInputStyled
                    placeholder={this.state.arenaName}
                    onChange={this.onArenaNameChange}
                    value={this.state.arenaName}
                    error={this.state.arenaName === ""}
                />
                <Content>
                    <Label>My Website</Label>
                    {editMainDomain ? (
                        <AutocompleteStyled
                            floating={true}
                            debounce={400}
                            loadingComponent={<DotsLoader />}
                            getListItems={this.getData}
                            searchIcon={"globe"}
                        />
                    ) : (
                        <FakeInputContainer>
                            <FakeInput onClear={this.onClearSelectedSite}>
                                <ListItemWebsite
                                    text={selectedSite.name}
                                    img={selectedSite.image}
                                />
                            </FakeInput>
                        </FakeInputContainer>
                    )}
                    <div style={{ height: 15 }}></div>
                    <Label>Country</Label>
                    <CountryContainerStyled>
                        <CountryFilter
                            width={538}
                            dropdownPopupWidth={538}
                            height={40}
                            appendTo=".sw-layout-scrollable-element"
                            cssClassContainer="MarketingWorkspaceWizard-countryContainer"
                            availableCountries={this.props.availableCountries}
                            selectedCountryIds={{ [this.props.selectedCountry.id]: true }}
                            changeCountry={this.props.onCountryChange}
                        />
                    </CountryContainerStyled>
                    <div style={{ height: 15 }}></div>
                    <Label>My Competitors</Label>
                    <CreationWizard
                        key={this.getCreationWizardKey()}
                        subscriptionComponent={this.props.subscriptionComponent}
                        suggestedWebsites={getSuggestions()}
                        getAutoComplete={getAutoComplete}
                        minSelectedItems={1}
                        initialScrollHeight={220}
                        showSuggestionsInAutoComplete={false}
                        onSelectedItemsChanged={onCompetitorsUpdate}
                        selectedItems={competitors}
                        onSaveButtonClick={this.onSave}
                        maxItems={4}
                        getPlaceHolderText={getPlaceHolderText}
                        onItemAdded={this.onItemAdded}
                        onItemDeleted={this.onItemDeleted}
                        isLoading={isLoading}
                        buttonText={buttonText}
                        buttonDisabled={this.isCreationButtonDisabled()}
                    />
                    {this.props.onDeleteArena && (
                        <DeleteButton
                            type="flatWarning"
                            onClick={this.toggleDeleteConfirmationModal}
                        >
                            {translate("workspaces.marketing.wizard.updatearena.delete")}
                        </DeleteButton>
                    )}
                </Content>
                <DeleteConfirmation
                    isOpen={this.state.showDeleteConfirmation}
                    onCloseClick={this.toggleDeleteConfirmationModal}
                    onCancelClick={this.toggleDeleteConfirmationModal}
                    onApproveClick={this.props.onDeleteArena}
                    deleteButtonIsLoading={this.props.isDeletingArena}
                    deleteButtonIsDisabled={this.props.isDeletingArena}
                    arenaName={this.state.arenaName}
                />
            </ContainerExtended>
        );
    }

    toggleDeleteConfirmationModal = () => {
        this.setState({
            showDeleteConfirmation: !this.state.showDeleteConfirmation,
        });
    };

    private isCreationButtonDisabled() {
        return this.state.editMainDomain || this.state.arenaName === "";
    }

    // use this function to re render creation wizard when competitors list has changed
    private getCreationWizardKey = () => {
        return this.props.competitors.reduce((key, { name }) => `${key}-{name}`, "");
    };

    private getData = async (query: string) => {
        this.setState({
            isLoading: true,
        });
        const items: ISite[] = await this.props.getWebsitesSuggestions(query);
        this.setState({
            isLoading: false,
        });
        return items.map(({ name, image }) => (
            <ListItemWebsite
                key={name}
                img={image}
                text={name}
                onClick={() => this.onSelectSite({ name, image })}
            />
        ));
    };

    public onSelectSite({ name, image }) {
        this.props.onSelectMainSite({ name, image });
        this.setState({ editMainDomain: false });
    }

    private onSave = (selectedItems) => {
        this.props.onSave(this.state.arenaName);
        const { track } = this.context;
        track(
            "wizard",
            "click",
            `marketing wizard/competitors/${selectedItems.map((item) => item.name)}`,
        );
    };

    private onArenaNameChange = (e) => {
        this.setState({
            arenaName: e.target.value,
        });
    };

    private onClearSelectedSite = () => {
        this.setState({
            editMainDomain: true,
        });
        this.props.onClearMainSite();
    };

    onItemAdded = (name, source) => {
        const { track } = this.context;
        track(
            "wizard",
            "click",
            `marketing wizard/add competitor ${
                source === "suggested" ? "suggestion" : "manually"
            }/${name}`,
        );
    };

    onItemDeleted = (name) => {
        const { track } = this.context;
        track("wizard", "click", `marketing wizard/remove competitor/${name}`);
    };

    static contextTypes = {
        ...contextTypes,
        goToStep: PropTypes.func.isRequired,
    };
}
