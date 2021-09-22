import * as _ from "lodash";
import * as React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled, { css } from "styled-components";
import { PureComponent, StatelessComponent } from "react";
import { connect } from "react-redux";
import {
    IDashboardTemplate,
    DashboardTemplateService,
    EDashboardParentType,
} from "../DashboardTemplateService";
import { DashboardTemplate } from "./DashboardTemplate";
import SWReactRootComponent from "../../../../decorators/SWReactRootComponent";
import {
    clearSelectedTemplate,
    selectDashboardTemplate,
    templateSetParent,
} from "../actions/dashboardTemplateActions";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import autobind from "autobind-decorator";
import { respondTo, setFont } from "@similarweb/styles/src/mixins";
import { allTrackers } from "../../../../services/track/track";
import { i18nFilter } from "../../../../filters/ngFilters";
import { SWReactIcons } from "@similarweb/icons";
import I18n from "../../../React/Filters/I18n";

const widths = {
    large: 1137,
    medium: 1063,
    small: 805,
};

const upgrade = (title) => {
    allTrackers.trackEvent("Contactus/Contact Us Page", "click", `dashboard gallery/${title}`);
    window.open("https://www.similarweb.com/corp/contact/");
};

const DashboardTemplateGrid = styled.div`
    width: ${widths.large}px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 63px;
    padding-bottom: 50px;
    @media (max-width: 1440px) {
        width: ${widths.medium}px;
        grid-column-gap: 26px;
    }
    @media (max-width: 1366px) {
        width: 1027px;
        grid-column-gap: 6px;
    }
    ${respondTo(
        "desktop",
        css`
            width: 100%;
            grid-gap: 39px;
            grid-column-gap: 39px;
            padding: 0 109px;
            box-sizing: border-box;
            grid-template-columns: 1fr 1fr;
        `,
    )};
`;

const DashboardTemplateGalleryHeader = styled.div`
    width: ${widths.large}px;
    margin: 0 auto !important;
    flex-direction: row-reverse;
    @media (max-width: 1440px) {
        width: ${widths.medium}px;
    }
    ${respondTo(
        "mediumScreen",
        css`
            width: 1027px;
            padding: 0;
            box-sizing: border-box;
        `,
    )};
    ${respondTo(
        "desktop",
        css`
            width: 932px;
            padding: 0 109px;
            box-sizing: border-box;
        `,
    )};
`;

const DashboardTemplateNoResults = styled.div`
    height: 316px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 72px;
`;

const DashboardTemplateNoResultsIcon = styled(SWReactIcons).attrs({
    iconName: "no-search-results",
})`
    height: 48px;
    width: 48px;
    margin-bottom: 23px;
`;

const DashboardTemplateNoResultsIconTitle = styled.div`
    ${setFont({ $color: "rgba(42,62,82,0.6)", $size: 24 })};
    margin-bottom: 10px;
`;

const DashboardTemplateNoResultsIconSubTitle = styled(DashboardTemplateNoResultsIconTitle)`
    ${setFont({ $size: 14 })};
`;

interface IDashboardTemplateGalleryProps {
    onTemplateClick: (templateName: string) => void;
    clearSelectedTemplate: () => void;
    selectedTemplate: number | string;
}

interface IDashboardTemplateGalleryState {
    loading: boolean;
    // templates?: dashboardTemplate[];
    templates?: IDashboardTemplate[];
    search?: string;
}

export class DashboardTemplateGallery extends PureComponent<
    IDashboardTemplateGalleryProps,
    IDashboardTemplateGalleryState
> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
        };
    }

    async componentDidMount() {
        if (this.props.selectedTemplate === "blank") {
            this.props.clearSelectedTemplate();
        }
        const templates = await DashboardTemplateService.generateDashboardTemplates();
        this.setState({
            loading: false,
            templates,
        });
    }

    public render() {
        if (this.state.loading) {
            return this.renderLoader();
        } else {
            return this.renderGallery();
        }
    }

    private renderLoader() {
        return null;
    }

    private renderGallery() {
        const { onTemplateClick } = this.props;
        const search = (this.state.search || "").toLowerCase();
        const templates = this.state.templates.filter((template) => {
            const { title, description, sticky } = template;
            // return sticky || _.includes(title.toLowerCase(), search) || _.includes(description.toLowerCase(), search);
            return (
                i18nFilter()(title).toLowerCase().includes(search) ||
                i18nFilter()(description).toLowerCase().includes(search)
            );
        });
        return (
            <div>
                <DashboardTemplateGalleryHeader className="react-wizard-filter">
                    <SearchInput
                        isFocused={true}
                        placeholder={i18nFilter()("dashboard.metricGallery.searchPlaceholder")}
                        className="react-wizard-filter-input"
                        onChange={this.handleSearch}
                        onBlur={this.track}
                    />
                </DashboardTemplateGalleryHeader>
                {templates.length > 0 ? (
                    <DashboardTemplateGrid>
                        {templates.map((template, index) => {
                            const {
                                id,
                                locked,
                                thumbnailImage,
                                title,
                                description,
                                empty,
                                isNew,
                            } = template;
                            return (
                                <DashboardTemplate
                                    id={id}
                                    key={`template${index}`}
                                    locked={locked}
                                    empty={empty}
                                    image={thumbnailImage}
                                    title={i18nFilter()(title)}
                                    description={i18nFilter()(description)}
                                    onClick={
                                        !locked
                                            ? onTemplateClick.bind(null, id, title)
                                            : upgrade.bind(this, title)
                                    }
                                    isNew={isNew}
                                />
                            );
                        })}
                    </DashboardTemplateGrid>
                ) : (
                    <DashboardTemplateNoResults>
                        <DashboardTemplateNoResultsIcon />
                        <DashboardTemplateNoResultsIconTitle>
                            <I18n>dashboard.template.nosearchresults.title</I18n>
                        </DashboardTemplateNoResultsIconTitle>
                        <DashboardTemplateNoResultsIconSubTitle>
                            <I18n>dashboard.template.nosearchresults.tryagain</I18n>
                        </DashboardTemplateNoResultsIconSubTitle>
                    </DashboardTemplateNoResults>
                )}
            </div>
        );
    }

    @autobind
    private handleSearch(search) {
        this.setState({
            search,
        });
    }

    private track = () => {
        // for tracking only after the user start's to input in the search bar
        if (this.state.search !== undefined) {
            TrackWithGuidService.trackWithGuid(
                "dashboard.template.gallery.search",
                this.state.search.length > 0 ? "click" : "remove",
                { query: this.state.search ? this.state.search : null },
            );
        }
    };
}

function mapStateToProps(state) {
    return {
        selectedTemplate: state.customDashboard.dashboardTemplate.selectedTemplate,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onTemplateClick: (id, title: string) => {
            allTrackers.trackEvent("dashboard template", "click", title);
            dispatch(selectDashboardTemplate(id));
            dispatch(templateSetParent(EDashboardParentType.TEMPLATE, id));
        },
        clearSelectedTemplate: () => dispatch(clearSelectedTemplate()),
    };
}

const connected = connect(mapStateToProps, mapDispatchToProps)(DashboardTemplateGallery);

SWReactRootComponent(connected, "DashboardTemplateGallery");
