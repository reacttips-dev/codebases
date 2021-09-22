import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { truncateText } from "@similarweb/styles/src/mixins";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { Button } from "@similarweb/ui-components/dist/button";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import { DotsLoader, FakeInput } from "@similarweb/ui-components/dist/search-input";
import * as PropTypes from "prop-types";
import * as React from "react";
import styled, { css } from "styled-components";
import { CountryFilter } from "../../../../../../app/components/filters-bar/country-filter/CountryFilter";
import { ICountryObject } from "../../../../../../app/services/CountryService";
import { TrackWithGuidService } from "../../../../../../app/services/track/TrackWithGuidService";
import SmallSiteNotificationPopup from "../../../../SmallSiteNotification/src/SmallSiteNotificatonPopup";
import { ISite } from "../types";
import { contextTypes } from "../WithContext";
import { BackButton } from "../Wizard";
import {
    ButtonsContainer,
    Container,
    CountryContainerStyled,
    FakeInputContainer,
    Label,
    MainWebsite,
    subtitleFadeIn,
    Title,
} from "./StyledComponents";

export const Content = styled.div`
    width: 538px;
    animation: ${subtitleFadeIn} ease-in-out 1000ms;
`;
Content.displayName = "Content";

const ChooseMySiteContainer = styled(Container)`
    padding: 31px 32px 32px 41px;
    .ItemText {
        ${truncateText()};
        max-width: 400px;
    }
`;

const ChooseMySiteTitle = styled(Title)`
    line-height: 1.2;
`;

const ChooseMySiteSubDomainsText = styled.div`
    color: ${colorsPalettes.carbon[300]};
`;

const ChooseMySiteLabel = styled(Label)`
    margin: 0;
`;
const SubTitle = styled.div`
    font-size: 12px;
    color: rgba(42, 62, 82, 0.6);
    margin-top: 4px;
    line-height: 1.33;
    animation: ${subtitleFadeIn} ease-in-out 1000ms;
`;

const ErrorWrapper = styled.div`
    font-size: 12px;
    margin-top: 6px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
`;

const ErrorLabel = styled.div`
    color: ${colorsPalettes.red["400"]};
`;

const InputContainer = styled.div``;

const FirstArenaDisclaimer = styled.div`
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    margin-bottom: 14px;
`;

const ChooseMySiteCountryContainerStyled = styled(CountryContainerStyled)`
    margin: 0;
`;

const TextFieldContainer = styled.div`
    height: 66px;
`;
const TrialBackButton: any = styled(BackButton)`
    padding-left: 0;
`;
export interface IChooseMySiteProps {
    // website
    getWebsitesSuggestions: (query: string) => Promise<Array<ISite & { blockStatus: boolean }>>;
    onSelectMainSite: (site: ISite & { isBlackList: boolean }) => void;
    onClearMainSite: () => void;
    selectedSite: ISite & { isBlackList: boolean };

    // country
    showCountryInput?: boolean;
    selectedCountry: ICountryObject;
    availableCountries: ICountryObject[];
    onCountryChange: (country) => void;

    enableSmallSiteNotification?: boolean;
    isFirstArena?: boolean;
    showBackButton?: boolean;

    // text
    title?: string;
    subtitle?: string;
    submitButtonText?: string;
}

export class ChooseMySite extends React.Component<IChooseMySiteProps> {
    public static contextTypes = {
        ...contextTypes,
        goToStep: PropTypes.func.isRequired,
        onClickBack: PropTypes.func,
    };
    public static defaultProps = {
        isFirstArena: false,
        showBackButton: false,
        showCountryInput: true,
        title: "workspaces.marketing.wizard.enter_a_website",
        subtitle: "workspaces.marketing.wizard.sub_title",
        submitButtonText: "workspaces.marketing.wizard.continue",
    };
    public state = {
        isLoading: false,
        ignoreSmallSite: true,
        inputIsEmpty: false,
    };
    public getData = async (query: string) => {
        this.setState({
            isLoading: true,
        });
        query = query.slice(0, 4).toLowerCase() === "www." ? query.slice(4) : query;
        const items: Array<
            ISite & { blockStatus: boolean }
        > = await this.props.getWebsitesSuggestions(query);
        this.setState({
            isLoading: false,
        });
        if (this.state.inputIsEmpty) {
            return [];
        }
        return items.map(({ name, image, blockStatus: isBlackList }) => (
            <ListItemWebsite
                key={name}
                img={image}
                text={name}
                onClick={() => this.onSelectSite({ name, image, isBlackList })}
            />
        ));
    };

    public onBlur = (query) => {
        if (!this.props.selectedSite && query !== "") {
            this.setState({ inputIsEmpty: true });
        }
        return;
    };

    public SelectSite = (props) => (
        <Autocomplete
            floating={true}
            debounce={400}
            isLoading={this.state.isLoading}
            isFocused={true}
            loadingComponent={<DotsLoader />}
            placeholder={props.placeholder}
            isError={this.state.inputIsEmpty}
            errorIndicator={this.state.inputIsEmpty}
            onBlur={this.onBlur}
            getListItems={this.getData}
            searchIcon="globe"
            onFocus={this.onFocus}
        />
    );

    public ShowSite = () => {
        const { name, image, isBlackList } = this.props.selectedSite;
        const { enableSmallSiteNotification } = this.props;

        return (
            <FakeInputContainer>
                <FakeInput onClear={this.onClearSelectedSite}>
                    <SmallSiteNotificationPopup
                        isOpen={this.isSmallSiteNotificationOpen()}
                        site={name}
                        onContinueClick={this.onSmallSiteNotificationContinueClick}
                        onEnterClick={this.onSmallSiteNotificationEditClick}
                        trackPopup={this.trackPopup}
                    >
                        <div>
                            <ListItemWebsite
                                text={name}
                                img={image}
                                isError={enableSmallSiteNotification && !!isBlackList}
                            />
                        </div>
                    </SmallSiteNotificationPopup>
                </FakeInput>
            </FakeInputContainer>
        );
    };

    public trackPopup = () => {
        TrackWithGuidService.trackWithGuid(
            "new_arena.main_website.small_site_notification_popup",
            "open",
            { location: "/choose main website" },
        );
    };

    public onClearSelectedSite = () => {
        this.props.onClearMainSite();
    };

    public onSelectSite({ name, image, isBlackList }) {
        if (this.props.enableSmallSiteNotification) {
            this.setState({
                ignoreSmallSite: false,
                inputIsEmpty: false,
            });
        }
        this.props.onSelectMainSite({ name, image, isBlackList });
    }

    public moveNext = () => {
        if (this.props.selectedSite === null) {
            this.setState({ inputIsEmpty: true });
        } else if (this.isSmallSiteNotificationOpen()) {
            return;
        } else {
            const { name } = this.props.selectedSite;
            const countryName = this.props?.selectedCountry?.text || "";
            this.context.track(
                "button",
                "click",
                `workspace/marketing/wizard/apply-selected/${name}/${countryName}`,
            );
            this.context.goToStep(1);
        }
    };

    public render() {
        const { selectedSite, isFirstArena, showBackButton, showCountryInput } = this.props;
        const { SelectSite, ShowSite } = this;
        const { translate, onClickBack } = this.context;
        const selectedCountry = this.props.selectedCountry
            ? { [this.props.selectedCountry.id]: true }
            : {};

        return (
            <ChooseMySiteContainer>
                <ChooseMySiteTitle>{translate(this.props.title)}</ChooseMySiteTitle>
                <SubTitle>{translate(this.props.subtitle)}</SubTitle>
                <Content>
                    <MainWebsite>
                        {translate("workspaces.marketing.wizard.primary_website")}
                    </MainWebsite>
                    <InputContainer>
                        {selectedSite ? (
                            <ShowSite />
                        ) : (
                            <SelectSite
                                placeholder={translate(
                                    "workspaces.marketing.wizard.new_arena.website.input.placeholder",
                                )}
                            />
                        )}
                    </InputContainer>
                    <ErrorWrapper>
                        <ChooseMySiteSubDomainsText>
                            {translate("workspaces.marketing.wizard.include_subdomains")}
                        </ChooseMySiteSubDomainsText>
                        {this.state.inputIsEmpty && (
                            <ErrorLabel>
                                {translate(
                                    "workspaces.marketing.wizard.new_arena.website.input.placeholder.error.nonSelectedWebsite",
                                )}
                            </ErrorLabel>
                        )}
                    </ErrorWrapper>
                    {showCountryInput && (
                        <>
                            <ChooseMySiteLabel>Country</ChooseMySiteLabel>
                            <ChooseMySiteCountryContainerStyled>
                                <CountryFilter
                                    width={538}
                                    height={40}
                                    dropdownPopupWidth={538}
                                    appendTo=".sw-layout-scrollable-element"
                                    cssClassContainer="MarketingWorkspaceWizard-countryContainer"
                                    availableCountries={this.props.availableCountries}
                                    selectedCountryIds={selectedCountry}
                                    changeCountry={this.props.onCountryChange}
                                    onToggle={this.onToggle}
                                />
                            </ChooseMySiteCountryContainerStyled>
                        </>
                    )}
                </Content>
                <ButtonsContainer showBackButton={showBackButton}>
                    {showBackButton && (
                        <TrialBackButton
                            visible={true}
                            backButtonText={"workspaces.marketing.wizard.goback"}
                            onClickBack={onClickBack}
                        />
                    )}
                    <Button type="primary" onClick={this.moveNext}>
                        {translate(this.props.submitButtonText)}
                    </Button>
                </ButtonsContainer>
            </ChooseMySiteContainer>
        );
    }

    private onFocus = () => {
        this.setState({ inputIsEmpty: false });
    };

    private onSmallSiteNotificationContinueClick = () => {
        TrackWithGuidService.trackWithGuid(
            "workspace.marketing.create_arena.main_website.small_site_notification.continue_click",
            "click",
        );
        this.setState({ ignoreSmallSite: true });
    };

    private onSmallSiteNotificationEditClick = () => {
        TrackWithGuidService.trackWithGuid(
            "workspace.marketing.create_arena.main_website.small_site_notification.remove_click",
            "click",
        );
        this.onClearSelectedSite();
    };

    private isSmallSiteNotificationOpen = () => {
        const { selectedSite, enableSmallSiteNotification } = this.props;
        const { ignoreSmallSite } = this.state;
        return (
            selectedSite &&
            selectedSite.isBlackList &&
            !ignoreSmallSite &&
            enableSmallSiteNotification
        );
    };

    private onToggle = (isOpen) => {
        TrackWithGuidService.trackWithGuid(
            "workspace.marketing.create_arena.main_website.country_filter",
            "click",
            { toggle: isOpen ? "/open" : "/close" },
        );
    };
}
