import { SWReactIcons } from "@similarweb/icons";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { AutosizeInput } from "@similarweb/ui-components/dist/autosize-input";
import { Button } from "@similarweb/ui-components/dist/button";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import { DotsLoader, FakeInput } from "@similarweb/ui-components/dist/search-input";
import I18n from "components/WithTranslation/src/I18n";
import { Container, Title } from "components/Workspace/Wizard/src/steps/StyledComponents";
import { ISite } from "components/Workspace/Wizard/src/types";
import { contextTypes } from "components/Workspace/Wizard/src/WithContext";
import * as PropTypes from "prop-types";
import * as React from "react";
import {
    BetaLabelContainer,
    ButtonContainer,
    Content,
    ErrorLabel,
    FakeInputContainerStyled,
    Label,
    OptInBannerContainer,
    OptInBannerRow,
    OptInBannerSection,
    OptInBannerTextDescription,
    OptInBannerTextMain,
    ShareDisclaimerContainer,
    UserSegmentListTypeSelectorContainer,
} from "./StyledComponent";
import { UserSegmentListTypeSelector } from "./UserSegmentListTypeSelector";
import { IWithUseAdvancedPref, withUseAdvancedPref } from "pages/segments/withUseAdvancedPref";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { ENABLE_FIREBOLT, SegmentsUtils } from "services/segments/SegmentsUtils";
import { BetaLabel } from "components/BetaLabel/BetaLabel";

export interface IUserSegmentType {
    id: string;
    name: string;
}

export interface ISegmentCreateUpdateFirstStepProps extends IWithUseAdvancedPref {
    // website
    getWebsitesSuggestions: (query: string) => Promise<ISite[]>;
    onSelectMainSite: (site: ISite) => void;
    onChangeSegmentName: (name: string) => void;
    onBlurSegmentName: (name: string) => void;
    onClearMainSite: () => void;
    selectedSite?: ISite;
    isSelectedSiteAllowed?: boolean;
    segmentName?: string;
    userSegmentTypes: IUserSegmentType[];
    segmentSelectedType?: IUserSegmentType;
    onSelectSegmentType: (type: IUserSegmentType) => void;
}

export interface IDomainWhitelisted {
    domain: string;
    isWhitelisted: string;
    isRobotsTxt: boolean;
}

export class SegmentCreateUpdateFirstStepComponent extends React.Component<
    ISegmentCreateUpdateFirstStepProps
> {
    public static contextTypes = {
        ...contextTypes,
        goToStep: PropTypes.func.isRequired,
    };

    public static getDerivedStateFromProps(nextProps, prevState) {
        const nextState: any = {};

        if (nextProps.selectedSite && prevState.isSelectingSite) {
            nextState.isSelectingSite = false;
            nextState.showOptInBanner =
                !nextProps.isSelectedSiteAllowed &&
                nextProps.selectedSite?.validation?.isRobotsTxt &&
                !nextProps.selectedSite?.validation?.isWhiteListed;
        }

        return Object.keys(nextState).length ? nextState : null;
    }

    public state = {
        isLoading: false,
        inputIsEmpty: false,
        isSelectingSite: false,
        showOptInBanner: false,
    };

    public getData = async (query: string) => {
        this.setState({
            isLoading: true,
        });
        query = query.slice(0, 4).toLowerCase() === "www." ? query.slice(4) : query;
        const items: ISite[] = await this.props.getWebsitesSuggestions(query);
        this.setState({
            isLoading: false,
        });
        if (this.state.inputIsEmpty) {
            return [];
        }
        return items.map(({ name, image }) => (
            <ListItemWebsite
                key={name}
                img={image}
                text={name}
                onClick={() => this.onSelectSite({ name, image })}
            />
        ));
    };

    public onBlur = (query) => {
        if (!this.props.selectedSite && !this.state.isSelectingSite && query !== "") {
            // prevent set input is empty when selecting site in progress
            this.setState({ inputIsEmpty: true });
        }
        return;
    };

    public onFocus = () => {
        this.setState({ inputIsEmpty: false });
    };

    public SelectSite = (props) => (
        <Autocomplete
            disabled={props.isDisabled}
            floating={true}
            debounce={400}
            isLoading={this.state.isLoading}
            loadingComponent={<DotsLoader />}
            placeholder={props.placeholder}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            isError={this.state.inputIsEmpty}
            errorIndicator={this.state.inputIsEmpty}
            getListItems={this.getData}
            searchIcon={"globe"}
        />
    );

    public ShowSite = () => {
        const { selectedSite, isSelectedSiteAllowed } = this.props;
        const { name, image, validation } = selectedSite;
        const { showOptInBanner } = this.state;
        const { translate } = this.context;
        const isMidTierUser = SegmentsUtils.isMidTierUser();
        let errorMsg;
        if (!isSelectedSiteAllowed) {
            if (validation.isInvalid) {
                errorMsg = translate(
                    "workspaces.autocomplete.wizard.domain.invalid.input.error.label",
                );
            } else if (isMidTierUser && !validation.isRobotsTxt) {
                errorMsg = translate(
                    "workspaces.autocomplete.wizard.domain.input.error.robots.txt.label",
                );
            } else if (!validation.isWhitelisted) {
                errorMsg = ENABLE_FIREBOLT
                    ? translate("workspaces.autocomplete.wizard.domain.input.error.advanced.label")
                    : translate("workspaces.autocomplete.wizard.domain.input.error.label");
            }
        }
        return (
            <>
                <FakeInputContainerStyled isValid={isSelectedSiteAllowed}>
                    <FakeInput onClear={this.onClearSelectedSite}>
                        <ListItemWebsite text={name} img={image} />
                    </FakeInput>
                </FakeInputContainerStyled>
                {errorMsg && <ErrorLabel>{errorMsg}</ErrorLabel>}
                {ENABLE_FIREBOLT && showOptInBanner && this.renderOptInBanner()}
            </>
        );
    };

    public renderOptInBanner = () => {
        const { useAdvancedPref } = this.props;
        return (
            <OptInBannerContainer>
                <OptInBannerRow justifyContent="space-between">
                    <OptInBannerSection>
                        <BetaLabelContainer>
                            <BetaLabel />
                        </BetaLabelContainer>
                        <OptInBannerTextMain>
                            <I18n>
                                {useAdvancedPref.value
                                    ? "custom.segments.wizard.banner.optout.main"
                                    : "custom.segments.wizard.banner.optin.main"}
                            </I18n>
                        </OptInBannerTextMain>
                    </OptInBannerSection>
                    <OptInBannerSection>
                        <OnOffSwitch
                            isSelected={useAdvancedPref.value}
                            onClick={() => useAdvancedPref.togglePref("Segment Creation")}
                        />
                    </OptInBannerSection>
                </OptInBannerRow>
                {useAdvancedPref.value ? null : (
                    <OptInBannerRow>
                        <OptInBannerSection>
                            <OptInBannerTextDescription>
                                <I18n>custom.segments.wizard.banner.optin.description</I18n>
                            </OptInBannerTextDescription>
                        </OptInBannerSection>
                    </OptInBannerRow>
                )}
            </OptInBannerContainer>
        );
    };

    public onClearSelectedSite = () => {
        this.setState({
            inputIsEmpty: false,
        });
        this.props.onClearMainSite();
    };

    public async onSelectSite({ name, image }) {
        this.setState({
            inputIsEmpty: false,
            isSelectingSite: true, // will be reset once selectedSite is changed (on getDerivedStateFromProps)
        });
        this.props.onSelectMainSite({ name, image });
    }
    public moveNext = () => {
        const { name } = this.props.selectedSite;
        this.context.track("button", "click", `segment/wizard/apply-selected/${name}`);
        this.context.goToStep(1);
    };

    public isFirstStepCompleted = () => {
        const { isSelectedSiteAllowed, segmentName, segmentSelectedType } = this.props;
        return (
            isSelectedSiteAllowed && segmentName && segmentName.length > 2 && segmentSelectedType
        );
    };

    public onChangeSegmentNameProxy = (event) => {
        const { onChangeSegmentName } = this.props;
        onChangeSegmentName(event.currentTarget.value);
    };

    public onBlurSegmentNameProxy = (event) => {
        const { onBlurSegmentName } = this.props;
        onBlurSegmentName(event.currentTarget.value);
    };

    public render() {
        const {
            selectedSite,
            segmentName,
            userSegmentTypes,
            onSelectSegmentType,
            segmentSelectedType,
        } = this.props;
        const { SelectSite, ShowSite } = this;
        const { translate } = this.context;
        return (
            <Container>
                <Title>{translate("workspaces.segment.wizard.enter_segment_properties")}</Title>
                <Content>
                    <div>
                        {selectedSite?.validation ? (
                            <ShowSite />
                        ) : (
                            <SelectSite
                                placeholder={translate(
                                    "workspaces.segment.wizard.website.input.placeholder",
                                )}
                            />
                        )}
                        {this.state.inputIsEmpty && !this.state.isSelectingSite && (
                            <ErrorLabel>
                                {translate(
                                    "workspaces.autocomplete.wizard.domain.input.error.nonSelectedWebsite",
                                )}
                            </ErrorLabel>
                        )}
                    </div>
                    <UserSegmentListTypeSelectorContainer>
                        <UserSegmentListTypeSelector
                            appendTo={"body"}
                            cssClassContainer={"segmentListTypeContainer"}
                            dropdownPopupPlacement="ontop-left"
                            onListTypeSelect={onSelectSegmentType}
                            userSegmentTypes={userSegmentTypes}
                            selectedSegmentType={segmentSelectedType}
                        />
                    </UserSegmentListTypeSelectorContainer>
                    <Label>{translate("workspaces.segment.wizard.segmentname.input.label")}</Label>
                    <AutosizeInput
                        onChange={this.onChangeSegmentNameProxy}
                        onBlur={this.onBlurSegmentNameProxy}
                        value={segmentName || ""}
                        maxLength={40}
                        placeholder={translate("workspaces.segment.wizard.segmentname.placeholder")}
                        error={segmentName && segmentName.length <= 2}
                    />
                </Content>
                <ButtonContainer>
                    <ShareDisclaimerContainer>
                        <SWReactIcons size={"sm"} iconName={"users-tab"} />
                        <I18n className={"disclaimer-text"}>
                            segment.wizard.first.step.share.disclaimer
                        </I18n>
                    </ShareDisclaimerContainer>
                    <Button
                        type="primary"
                        onClick={this.moveNext}
                        isDisabled={!this.isFirstStepCompleted()}
                    >
                        {translate("segment.wizard.button.continue")}
                    </Button>
                </ButtonContainer>
            </Container>
        );
    }
}

export const SegmentCreateUpdateFirstStep = withUseAdvancedPref(
    SegmentCreateUpdateFirstStepComponent,
);
