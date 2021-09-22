import { IRule } from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { useLoading } from "custom-hooks/loadingHook";
import { i18nFilter } from "filters/ngFilters";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import {
    SegmentVerifySectionContainer,
    TitleBox,
    RuleSummary,
    RulePrefix,
    CountryRow,
    SegmentShareContainer,
    VerifyShareContainer,
    SegmentShareLabelRow,
    SegmentShareDataRow,
    LoaderContainer,
    DropdownCountryFlagContainer,
    PublishSegmentContainer,
    VerifyButtonWrapper,
    LoadersMargin,
    SharePrcentageStyle,
    StyledShareBar,
    CountryFlagContainer,
} from "./SegemntsVerifySectionStyles";
import { Button } from "@similarweb/ui-components/dist/button";
import { ShareBar } from "@similarweb/ui-components/dist/share-bar";
import { colorsPalettes } from "@similarweb/styles";
import { DropdownReact } from "../../../../../components/dropdown/dropdown-react";
import { SWReactCountryIcons } from "@similarweb/icons";
import * as utils from "components/filters-bar/utils";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { minVisitsAbbrFilter, percentageFilter } from "../../../../../filters/ngFilters";
import * as _ from "lodash";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import SegmentsApiService from "services/segments/segmentsWizardService";
import rulesQueryHandler from "components/RulesQueryBuilder/src/handlers/rulesQueryHandler";

export interface ISegmentsVerifySection {
    domain: string;
    onCreateOrUpdateCustomSegments: (rules: IRule[]) => void;
    segmentRules?: IRule[];
}

const SegmentsVerifySection: React.FunctionComponent<ISegmentsVerifySection> = ({
    segmentRules,
    domain,
    onCreateOrUpdateCustomSegments,
}) => {
    const [selectedCountry, setSelectedCountry] = useState();
    const [verifyQuery, verifyQueryOps] = useLoading<any, string>();
    const prevRules = React.useRef(segmentRules);
    React.useEffect(() => {
        if (_.isEqual(prevRules.current, segmentRules)) {
            return;
        }
        verifyQueryOps.reset();
        prevRules.current = segmentRules;
    }, [segmentRules]);

    const fetchSegmentShare = useCallback(() => {
        const segmentsApiService = new SegmentsApiService();
        return segmentsApiService.calculateSegmentShare(
            domain,
            selectedCountry,
            rulesQueryHandler.filterEmptyRules(segmentRules),
        );
    }, [domain, selectedCountry, segmentRules]);

    const getSegmentShareData = useCallback(() => {
        return verifyQueryOps.load(() => fetchSegmentShare());
    }, [domain, selectedCountry, segmentRules]);

    const onCountryChange = (item) => {
        setSelectedCountry(item.id);
        verifyQueryOps.reset();
    };

    const renderLoaders = React.useMemo(() => {
        return (
            <LoaderContainer>
                <PixelPlaceholderLoader width={34} height={12} />
                <LoadersMargin marginLeft={"8px"}>
                    <PixelPlaceholderLoader width={97} height={12} />
                </LoadersMargin>
                <LoadersMargin marginLeft={"35px"}>
                    <PixelPlaceholderLoader width={55} height={12} />
                </LoadersMargin>
            </LoaderContainer>
        );
    }, []);

    const renderDataRow = React.useMemo(() => {
        const isLowShare = verifyQuery.data?.segmentShare < 0.01;
        const isLowShareOrVisits = isLowShare || verifyQuery.data?.visits < 5000;
        return (
            <SegmentShareDataRow isLowShare={isLowShareOrVisits}>
                <SharePrcentageStyle>
                    {isLowShare
                        ? "<1%"
                        : `${percentageFilter()(verifyQuery.data?.segmentShare, 0)}%`}
                </SharePrcentageStyle>
                <StyledShareBar>
                    <ShareBar
                        value={verifyQuery.data?.segmentShare}
                        hideValue={true}
                        hideChangeValue={true}
                        secondaryColor={colorsPalettes.carbon[100]}
                        primaryColor={
                            isLowShareOrVisits
                                ? colorsPalettes.red["s100"]
                                : colorsPalettes.blue["400"]
                        }
                    />
                </StyledShareBar>
                <div>{minVisitsAbbrFilter()(verifyQuery.data?.visits)}</div>
            </SegmentShareDataRow>
        );
    }, [verifyQuery.data]);

    const renderSegmentShareBar = () => {
        return (
            <SegmentShareContainer>
                <SegmentShareLabelRow>
                    <div>
                        {i18nFilter()(
                            "workspaces.segment.wizard.verify.section.verify.share.label",
                        )}
                    </div>
                    <div>
                        {i18nFilter()(
                            "workspaces.segment.wizard.verify.section.verify.visits.label",
                        )}
                    </div>
                </SegmentShareLabelRow>
                {verifyQuery.state === useLoading.STATES.LOADING ? renderLoaders : renderDataRow}
            </SegmentShareContainer>
        );
    };

    const PublishButtonBox = React.useMemo(() => {
        const isLowShareOrVisits =
            verifyQuery.data?.segmentShare < 0.01 || verifyQuery.data?.visits < 5000;
        const text =
            verifyQuery.state !== useLoading.STATES.LOADING
                ? isLowShareOrVisits
                    ? i18nFilter()(
                          "workspaces.segment.wizard.verify.section.verify.publish.low.text",
                      )
                    : i18nFilter()(
                          "workspaces.segment.wizard.verify.section.verify.publish.ready.text",
                      )
                : i18nFilter()(
                      "workspaces.segment.wizard.verify.section.verify.publish.loading.text",
                  );
        return (
            <PublishSegmentContainer>
                <div>{text}</div>
                <Button type="primary" onClick={onCreateOrUpdateCustomSegments}>
                    {i18nFilter()("workspaces.segment.wizard.calculate_segments")}
                </Button>
            </PublishSegmentContainer>
        );
    }, [verifyQuery]);

    const availableCountries = React.useMemo(() => {
        const allCountries = utils.getCountries().map((item) => {
            return {
                text: item.text,
                id: item.id,
            };
        });
        setSelectedCountry(
            allCountries.find((country) => country.id === 840).id || allCountries[0].id,
        );
        return allCountries;
    }, []);

    const renderItem = (item, isSelected) => {
        const label = item.text || item.title;
        return (
            <EllipsisDropdownItem
                key={item.id}
                id={item.id}
                text={label}
                selected={isSelected}
                iconName={item.icon}
                tooltipText={item.tooltipText}
                disabled={item.disabled}
                iconSize="sm"
            >
                <FlexRow>
                    <DropdownCountryFlagContainer>
                        <SWReactCountryIcons countryCode={item.id} />
                    </DropdownCountryFlagContainer>
                    {i18nFilter()(label)}
                </FlexRow>
            </EllipsisDropdownItem>
        );
    };

    const VerifyShareBox = React.useMemo(() => {
        return (
            <VerifyShareContainer isVerified={verifyQuery.state !== useLoading.STATES.INIT}>
                <CountryRow>
                    {"Last month performance in "}
                    <CountryFlagContainer>
                        <SWReactCountryIcons countryCode={selectedCountry} />
                    </CountryFlagContainer>
                    <DropdownReact
                        items={availableCountries}
                        renderItem={renderItem}
                        onChange={onCountryChange}
                        selected={selectedCountry}
                        titleColor={"#2a3e52"}
                        titleSize={16}
                        titleWeight={0}
                    />
                </CountryRow>
                {verifyQuery.state !== useLoading.STATES.INIT ? (
                    renderSegmentShareBar()
                ) : (
                    <VerifyButtonWrapper>
                        <Button
                            type="primary"
                            isDisabled={!SegmentsUtils.getRulesString(segmentRules)}
                            onClick={getSegmentShareData}
                            width={"172px"}
                        >
                            {i18nFilter()("workspaces.segment.wizard.verify.section.verify.button")}
                        </Button>
                    </VerifyButtonWrapper>
                )}
            </VerifyShareContainer>
        );
    }, [availableCountries, verifyQuery, selectedCountry, segmentRules]);

    return (
        <SegmentVerifySectionContainer>
            <TitleBox>{i18nFilter()("workspaces.segment.wizard.verify.section.title")}</TitleBox>
            {VerifyShareBox}
            {verifyQuery.state !== useLoading.STATES.INIT && PublishButtonBox}
        </SegmentVerifySectionContainer>
    );
};

function mapStateToProps({ segmentsWizardModule: { segmentRules } }) {
    return {
        segmentRules,
    };
}

export default connect(mapStateToProps)(SegmentsVerifySection);
