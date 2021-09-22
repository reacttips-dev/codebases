import { colorsPalettes, rgba } from "@similarweb/styles";
import { AutosizeInput } from "@similarweb/ui-components/dist/autosize-input";
import { BackButton } from "../Wizard";
import { Button } from "@similarweb/ui-components/dist/button";
import * as PropTypes from "prop-types";
import * as React from "react";
import styled, { css } from "styled-components";
import { ICountryObject } from "../../../../../../app/services/CountryService";
import { ICompetitor, ISite } from "../types";
import { WithContext } from "../WithContext";
import { ReadOnlyListItemCountry, ReadOnlyListItemWebsite } from "./SelectCompetitors";
import {
    buttonFadeIn,
    ButtonsContainer,
    Container,
    subtitleFadeIn,
    Title,
} from "./StyledComponents";
import { setFont, truncateText } from "@similarweb/styles/src/mixins";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

const Border = css` solid 1px ${rgba(colorsPalettes.blue[200], 0.7)}; `;

interface ISectionProps {
    input?: boolean;
    country?: boolean;
}

const SummaryContainer = styled(Container)`
    padding: 30px 35px 32px;
    .ListItemCountry {
        ${setFont({ $size: 12, $weight: 400, $color: colorsPalettes.carbon[300] })};
    }
    .ListItemCountry-icon {
        height: 16px;
        width: 16px;
        margin-right: 4px;
    }
    .ItemText {
        ${truncateText()};
        max-width: 168px;
    }
`;

const SummaryTitle = styled(Title)`
    min-height: 36px;
    line-height: 1.2;
    text-align: center;
    color: ${colorsPalettes.carbon[500]};
`;

const SummarySubtitle = styled.div`
    min-height: 16px;
    line-height: 1.33;
    text-align: center;
    margin-top: 4px;
    ${setFont({ $size: 12, $weight: 400, $color: colorsPalettes.carbon[300] })};
    animation: ${subtitleFadeIn} ease-in-out 1000ms;
`;

const ContentContainer = styled.div`
    min-width: 540px;
    min-height: 331px;
    border-radius: 3px;
    border: ${Border};
    margin-top: 16px;
    animation: ${buttonFadeIn} ease-in-out 500ms;
`;

const Section = styled.div<ISectionProps>`
    width: 540px;
    height: 205px;
    display: flex;
    justify-content: center;
    border-bottom: ${Border};
    ${({ input }) =>
        input &&
        css`
            height: 63px;
            color: ${colorsPalettes.carbon[200]};
        `}
    ${({ country }) =>
        country &&
        css`
            height: 62px;
            border-bottom: 0;
        `}
`;
Section.displayName = "Section";

const InputContainer = styled.div`
    display: flex;
    align-items: flex-end;
    flex-basis: 50%;
    padding-left: 70px;
    overflow: hidden;
`;

const InputOptional = styled.span`
    margin-top: 25px;
`;

const SelectedSites = styled.div<{ mySite?: boolean }>`
    height: 100%;
    width: 270px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: nowrap;
    padding-left: 32px;
    overflow: hidden;
    ${({ mySite }) =>
        mySite &&
        css`
            padding-left: 19px;
            padding-top: 3px;
            margin-right: 12px;
        `}
`;
SelectedSites.displayName = "SelectedSites";

const Seperator = styled.div`
    width: 2px;
    height: 206px;
    position: relative;
    background-color: ${rgba(colorsPalettes.blue[200], 0.7)};
`;

const Circle = styled.div`
    width: 32px;
    height: 32px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    left: calc(50% - 16px);
    top: 89px;
    ${setFont({ $size: 12.8, $weight: 500, $color: colorsPalettes.midnight[500] })};
    background-color: ${rgba(colorsPalettes.sky[100], 0.95)};
    line-height: normal;
    text-align: right;
    text-transform: uppercase;
    z-index: 1;
`;

const SelectedCountry = styled.div`
    display: flex;
    flex-direction: row;
    padding-left: 25px;
    justify-content: center;
    align-items: center;
    color: ${colorsPalettes.carbon[300]};
    span {
        margin-right: 4px;
    }
`;

const TrialBackButton: any = styled(BackButton)`
    padding-left: 0;
`;

interface ISummaryProps {
    selectedSite: ISite;
    selectedCountry: ICountryObject;
    competitors: ICompetitor[];
    isLoading: boolean;
    showBackButton: boolean;
    onSave: (name) => void;
    subscriptionComponent?: React.ReactNode;
}
interface ISummaryState {
    defaultArenaName: string;
    arenaName: string;
    inputWasInFocus: boolean;
    saveButtonDisabled: boolean;
}
export class Summary extends React.PureComponent<ISummaryProps, ISummaryState> {
    public static defaultProps = {
        showBackButton: false,
    };

    private static contextTypes = {
        onClickBack: PropTypes.func,
        translate: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);
        const { translate } = context;
        this.state = {
            defaultArenaName: translate(
                "workspaces.marketing.wizard.steps.summary.name.placeholder",
                {
                    name: this.props.selectedSite.name,
                    country: props.selectedCountry.text,
                },
            ),
            arenaName: "",
            inputWasInFocus: false,
            saveButtonDisabled: false,
        };
    }

    public render() {
        const { onClickBack } = this.context;
        const { arenaName, saveButtonDisabled } = this.state;
        const {
            selectedSite,
            competitors,
            selectedCountry,
            showBackButton,
            isLoading,
        } = this.props;
        return (
            <WithContext>
                {({ translate }) => (
                    <SummaryContainer>
                        <SummaryTitle>
                            {translate("workspaces.marketing.wizard.steps.summary.title")}
                        </SummaryTitle>
                        <SummarySubtitle>
                            {translate("workspaces.marketing.wizard.steps.summary.subtitle")}
                        </SummarySubtitle>
                        <ContentContainer>
                            <Section data-automation-name input>
                                <InputContainer>
                                    <AutosizeInput
                                        placeholder={translate(
                                            "workspaces.marketing.wizard.steps.summary.placeholder",
                                        )}
                                        onChange={this.onNameChange}
                                        value={arenaName}
                                        autoFocus={false}
                                        maxLength={30}
                                        onFocus={this.onFocus}
                                    />
                                </InputContainer>
                                {/*<InputOptional>{translate("workspaces.marketing.wizard.steps.summary.placeholder.optional")}</InputOptional>*/}
                            </Section>
                            <Section data-automation-sites>
                                <SelectedSites data-automation-my-site mySite>
                                    <ReadOnlyListItemWebsite
                                        text={selectedSite.name}
                                        image={selectedSite.image}
                                    />
                                </SelectedSites>
                                <Seperator>
                                    <Circle>
                                        {translate(
                                            "workspaces.marketing.wizard.steps.summary.competition",
                                        )}
                                    </Circle>
                                </Seperator>
                                <SelectedSites data-automation-competitors>
                                    {competitors.map(({ name, icon }) => (
                                        <ReadOnlyListItemWebsite
                                            key={name}
                                            text={name}
                                            image={icon}
                                        />
                                    ))}
                                </SelectedSites>
                            </Section>
                            <Section data-automation-country country>
                                <SelectedCountry>
                                    <span>
                                        {translate(
                                            "workspaces.marketing.wizard.steps.summary.country.prefix",
                                        )}
                                    </span>
                                    <ReadOnlyListItemCountry
                                        text={selectedCountry.text}
                                        countryCode={selectedCountry.id}
                                    />
                                </SelectedCountry>
                            </Section>
                        </ContentContainer>
                        {this.props.subscriptionComponent}
                        <ButtonsContainer showBackButton={showBackButton}>
                            {showBackButton && (
                                <TrialBackButton
                                    visible={true}
                                    backButtonText={"workspaces.marketing.wizard.goback"}
                                    onClickBack={onClickBack}
                                />
                            )}
                            <Button
                                isDisabled={saveButtonDisabled || isLoading}
                                type="primary"
                                onClick={this.onSave}
                                isLoading={isLoading}
                            >
                                {translate(
                                    "workspaces.marketing.wizard.steps.summary.gotoworkspace",
                                )}
                            </Button>
                        </ButtonsContainer>
                    </SummaryContainer>
                )}
            </WithContext>
        );
    }

    private onFocus = (event) => {
        if (!this.state.inputWasInFocus) {
            TrackWithGuidService.trackWithGuid("workspace.marketing.new.summary.input", "click");
            this.setState({ inputWasInFocus: true });
        }
    };

    private onSave = () => {
        let arenaName;
        const currentArenaName = this.state.arenaName;

        // conditional: at least one non-whitespace character exists in this.state.arenaName
        if (/\S/.test(currentArenaName)) {
            arenaName = currentArenaName.trim();
            TrackWithGuidService.trackWithGuid("workspace.marketing.new", "edit", {
                arenaName,
                onboarding: this.props.showBackButton ? "/onboarding" : null,
            });
        } else {
            arenaName = this.state.defaultArenaName;
        }

        this.props.onSave(arenaName);
    };

    private onNameChange = (event) => {
        this.setState({ arenaName: event.target.value });
    };
}
