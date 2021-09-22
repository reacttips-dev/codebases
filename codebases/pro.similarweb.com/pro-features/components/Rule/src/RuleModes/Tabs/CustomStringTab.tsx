import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { BooleanSearchInputWrap, Input } from "@similarweb/ui-components/dist/boolean-search";
import {
    BooleanSearchWrapStyled,
    TabMessageContainer,
    TabUrlListContainer,
    TabInnerContentContainer,
    InlineInputSection,
    GradientWhiteTransparentCover,
    BooleanSearchContainer,
    ImportFileBanner,
    ImportFileBannerText,
    ImportFileLink,
    SpanInputMeasure,
} from "../EditRule/EditRuleModeStyles";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { ISite } from "components/Workspace/Wizard/src/types";
import { IRule, RuleTypes } from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { ISegmentUrl } from "pages/segments/wizard/SegmentRulesStep/SegmentUrlList/SegmentUrlListTypes";
import rulesQueryHandler from "components/RulesQueryBuilder/src/handlers/rulesQueryHandler";
import SegmentUrlList from "pages/segments/wizard/SegmentRulesStep/SegmentUrlList/SegmentUrlList";
import { i18nFilter } from "filters/ngFilters";
import { SWReactIcons } from "@similarweb/icons";
import noop from "lodash/noop";
import { ImportCSVModal } from "components/Rule/src/RuleModes/EditRule/EditRuleModals/ImportCSVModal";
import { RuleSelectedStringsRow } from "components/Rule/src/RuleModes/EditRule/EditRuleComponents/RuleSelectedStringsRow";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

const UPDATE_PREVIEW_DEBOUNCE = 600;

interface ICustomStringTabProps {
    index: number;
    selectedSite: ISite;
    segmentRules: IRule[];
    getUrlsPreview: (segmentRules: IRule[]) => Promise<ISegmentUrl[]>;
    onAddItems: (itemStringsObj: { exact: string[] }) => void;
    onRemoveItems: (texts: string[]) => void;
    userSearchTerm?: string;
    hideUrlsPreview?: boolean;
    hasExistingUrlsCompundStringNoRobots: (segmentRules: IRule[]) => Promise<boolean>;
    isMidTierUser: boolean;
}

const CustomStringTab: React.FC<ICustomStringTabProps> = (props) => {
    const {
        index,
        userSearchTerm = "",
        selectedSite,
        segmentRules,
        getUrlsPreview,
        onAddItems,
        onRemoveItems,
        hideUrlsPreview = false,
        hasExistingUrlsCompundStringNoRobots,
        isMidTierUser,
    } = props;

    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const [customStringValue, setCustomStringValue] = React.useState(userSearchTerm?.toLowerCase());
    const [customStringInput, setCustomStringInput] = React.useState(customStringValue);
    const [urlsPreview, setUrlsPreview] = React.useState<ISegmentUrl[]>(undefined);
    const baseUrlsPreviewRef = React.useRef<ISegmentUrl[]>(undefined);
    const [urlsPreviewInProgress, setUrlsPreviewInProgress] = React.useState<boolean>(true); // automatically start getting of urls preview
    const [
        hasExistingUrlsCompundStringNoRobotsRes,
        setHasExistingUrlsCompundStringNoRobots,
    ] = React.useState<boolean>(false);
    const [applyWhenReady, setApplyWhenReady] = React.useState(false);
    const [isOpenImportModal, setIsOpenImportModal] = React.useState(false);
    const inputRef = React.useRef(null);
    const spanInputMeasureRef = React.useRef(null);
    const buttonsSectionRef = React.useRef(null);

    const hasUserInput = React.useMemo(() => {
        return customStringValue && customStringValue.trim().length > 0;
    }, [customStringValue]);

    const hasUrlsForInput = React.useMemo(() => {
        //first case is unique for sites with no robots txt file
        return hideUrlsPreview && !urlsPreviewInProgress
            ? hasExistingUrlsCompundStringNoRobotsRes
            : urlsPreview && urlsPreview.length > 0;
    }, [
        urlsPreview,
        hasExistingUrlsCompundStringNoRobotsRes,
        urlsPreviewInProgress,
        hideUrlsPreview,
    ]);

    const onAddExact = React.useCallback((exact: string[]) => onAddItems({ exact }), [onAddItems]);

    /**
     * Updates the URLs shown in the modal using the existing user-defined rules, and the custom string user input.
     * this method gets called via the useEffect hook above.
     */
    const updateUrlsPreview = async () => {
        setUrlsPreviewInProgress(true);

        // fetch all rules that were defined BEFORE the currently edited rule
        const rulesForUrlsPreview = segmentRules.slice(0, index);
        let isBaseRulesForUrlsPreview = true;
        // in case the user has defined a custom string, we should add it as a new rule, so that we could filter
        // all URLS according to all previously defined rules, INCLUDING the newly defined custom string
        if (customStringValue) {
            const customStringRule = rulesQueryHandler.createNewRule(
                RuleTypes.include,
                [],
                [customStringValue],
            );

            rulesForUrlsPreview.push(customStringRule);
            isBaseRulesForUrlsPreview = false;
        }
        if (hideUrlsPreview) {
            let hasExistingUrlsCompundStringNoRobotRes;
            try {
                hasExistingUrlsCompundStringNoRobotRes = await hasExistingUrlsCompundStringNoRobots(
                    rulesForUrlsPreview,
                );
            } catch (e) {
                hasExistingUrlsCompundStringNoRobotRes = false;
            }
            setHasExistingUrlsCompundStringNoRobots(hasExistingUrlsCompundStringNoRobotRes);
        }
        let updatedUrls;
        if (!isBaseRulesForUrlsPreview || !baseUrlsPreviewRef.current) {
            updatedUrls = await getUrlsPreview(rulesForUrlsPreview);
            if (isBaseRulesForUrlsPreview) {
                baseUrlsPreviewRef.current = updatedUrls;
            }
        }
        if (isBaseRulesForUrlsPreview) {
            updatedUrls = baseUrlsPreviewRef.current;
        }
        setUrlsPreview(updatedUrls);
        setUrlsPreviewInProgress(false);
    };

    const onRemoveCustomStrings = React.useCallback(onRemoveItems.bind(null, "exact"), [
        onRemoveItems,
    ]);

    /**
     * Updates the user input.
     * This will trigger an update of the urls preview, by useEffect on the customStringValue.
     */
    const changeCustomStringTimeoutRef = React.useRef(null);
    const changeCustomStringValue = React.useCallback(
        (newCustomStringValue, immediate = false) => {
            newCustomStringValue = decodeURIComponent(newCustomStringValue)
                ?.replace("http://www.", "")
                ?.replace("https://www.", "")
                ?.replace("http://", "")
                ?.replace("https://", "");
            const updateCustomStringValue = () => {
                setCustomStringValue(newCustomStringValue);
            };

            setCustomStringInput(newCustomStringValue);
            if (newCustomStringValue === customStringValue) {
                setUrlsPreviewInProgress(false); // stop loading indicator before updating
            }

            clearTimeout(changeCustomStringTimeoutRef.current);
            if (immediate) {
                updateCustomStringValue();
            } else {
                setUrlsPreviewInProgress(true); // start loading indicator when starting the debounce
                changeCustomStringTimeoutRef.current = setTimeout(
                    updateCustomStringValue,
                    UPDATE_PREVIEW_DEBOUNCE,
                );
            }
        },
        [setCustomStringInput, setUrlsPreviewInProgress, customStringValue],
    );

    const handleCustomStringInput = React.useCallback(
        (evt) => {
            changeCustomStringValue(evt.target.value);
        },
        [changeCustomStringValue],
    );

    const handleCustomStringKeyUp = React.useCallback(
        (evt) => {
            switch (evt.key) {
                case "Enter":
                    setApplyWhenReady(true);
                    changeCustomStringValue(evt.target.value, true);
                    break;
                case "Escape":
                    changeCustomStringValue("", true);
                    break;
                default:
                    break;
            }
        },
        [changeCustomStringValue, setApplyWhenReady],
    );

    const handleApply = React.useCallback(async () => {
        // prevent adding a word when in progress or no urls
        if (urlsPreviewInProgress || !hasUserInput) {
            return;
        }

        onAddExact([customStringValue]);

        // Reset user input to the initial state
        changeCustomStringValue("", true);
    }, [
        hasUrlsForInput,
        urlsPreviewInProgress,
        customStringValue,
        onAddExact,
        changeCustomStringValue,
    ]);

    const openImportFileModal = React.useCallback(() => {
        TrackWithGuidService.trackWithGuid(
            "segment.wizard.custom.string.open.upload.file.modal",
            "click",
        );
        setIsOpenImportModal(true);
    }, []);

    const closeImportFileModal = React.useCallback(() => {
        TrackWithGuidService.trackWithGuid(
            "segment.wizard.custom.string.close.upload.file.modal",
            "click",
        );
        setIsOpenImportModal(false);
    }, []);

    const handleImportStrings = React.useCallback(
        (strings) => {
            TrackWithGuidService.trackWithGuid(
                "segment.wizard.custom.string.upload.file.modal.import.button",
                "click",
            );
            onAddExact(strings);
        },
        [onAddExact],
    );
    const handleDownloadSampleCsv = React.useCallback((event: any) => {
        TrackWithGuidService.trackWithGuid(
            "segment.wizard.custom.string.upload.file.modal.download.csv.sample.file",
            "click",
        );
    }, []);

    // user input has changed, we want to update all URLS shown in the preview.
    React.useEffect(() => {
        updateUrlsPreview().then();
    }, [customStringValue]);

    // Note: apply the current custom string when flag is true and urls preview is ready
    React.useEffect(() => {
        if (applyWhenReady && !urlsPreviewInProgress) {
            setApplyWhenReady(false);
            handleApply();
        }
    }, [applyWhenReady, urlsPreviewInProgress]);

    // calculate input text width to place the ADD button just afterwards.
    React.useLayoutEffect(() => {
        spanInputMeasureRef.current.textContent = customStringInput;
        const textContentWidth = spanInputMeasureRef.current.offsetWidth;
        const posLeft = customStringInput
            ? Math.min(textContentWidth, inputRef.current.offsetWidth) // place after text or max at the end of input
            : inputRef.current.offsetWidth; // if empty then place at the end of input
        buttonsSectionRef.current.style.left = `${posLeft}px`;
        buttonsSectionRef.current.style.paddingRight = `${
            inputRef.current.offsetWidth - posLeft
        }px`; // pad right to the button to avoid input click
    }, [customStringInput]);

    const renderUrlList = () => {
        const exactPhrasesToHighlight = customStringValue ? [customStringValue] : [];

        return (
            <SegmentUrlList
                selectedSite={selectedSite?.name ?? ""}
                urls={urlsPreview}
                wordHightlights={[]}
                exactPhraseHighlights={exactPhrasesToHighlight}
                shouldShowFilter={false}
            />
        );
    };

    const renderNoUrlsMsg = () => {
        return (
            <TabMessageContainer>
                <p>
                    {services.i18n("segmentWizard.editRule.custom.string.modal.no.results.part1")}
                </p>
                <p>
                    {services.i18n("segmentWizard.editRule.custom.string.modal.no.results.part2")}
                </p>
            </TabMessageContainer>
        );
    };

    const stringNoUrlsMsg = () =>
        [
            services.i18n("segmentWizard.editRule.custom.string.modal.no.results.part1"),
            services.i18n("segmentWizard.editRule.custom.string.modal.no.results.part2"),
        ].join(" ");

    return (
        <TabInnerContentContainer>
            <ImportFileBanner>
                <ImportFileBannerText>
                    {services.i18n("segmentWizard.editRule.custom.string.modal.desc.importStrings")}
                </ImportFileBannerText>
                <ImportFileLink onClick={openImportFileModal}>
                    <SWReactIcons iconName="download" size="xs" />
                    {services.i18n(
                        "segmentWizard.editRule.custom.string.modal.button.importStrings",
                    )}
                </ImportFileLink>
            </ImportFileBanner>
            <BooleanSearchContainer>
                <BooleanSearchWrapStyled marginLeft="100px">
                    <SWReactIcons size="sm" iconName="add" />
                    <BooleanSearchInputWrap>
                        <Input
                            ref={inputRef}
                            placeholder={services.i18n(
                                "segmentWizard.editRule.custom.string.modal.input",
                            )}
                            value={customStringInput}
                            onChange={isMidTierUser ? noop : handleCustomStringInput}
                            onKeyUp={isMidTierUser ? noop : handleCustomStringKeyUp}
                            autoFocus={!isMidTierUser}
                        />
                        <SpanInputMeasure ref={spanInputMeasureRef} />
                        <InlineInputSection ref={buttonsSectionRef}>
                            {customStringInput && (
                                <Button
                                    className="inlineButton"
                                    type="outlined"
                                    onClick={handleApply}
                                    isLoading={urlsPreviewInProgress}
                                    isDisabled={!hasUserInput || urlsPreviewInProgress}
                                >
                                    {services.i18n(
                                        "segmentWizard.editRule.custom.string.modal.button",
                                    )}
                                </Button>
                            )}
                            {urlsPreviewInProgress && <DotsLoader />}
                        </InlineInputSection>
                    </BooleanSearchInputWrap>
                </BooleanSearchWrapStyled>
            </BooleanSearchContainer>
            {!hideUrlsPreview && (
                <TabUrlListContainer>
                    {hasUrlsForInput
                        ? renderUrlList()
                        : urlsPreviewInProgress
                        ? null
                        : renderNoUrlsMsg()}
                </TabUrlListContainer>
            )}
            {segmentRules[index].exact.length > 0 && (
                <RuleSelectedStringsRow
                    stringsList={segmentRules[index].exact}
                    title={services.i18n("segmentWizard.editRule.custom.string.row.title")}
                    onRemoveStrings={onRemoveCustomStrings}
                />
            )}
            {isMidTierUser && <GradientWhiteTransparentCover />}
            <ImportCSVModal
                isOpen={isOpenImportModal}
                onClose={closeImportFileModal}
                onImportSuccess={handleImportStrings}
                onDownloadSampleCsvClick={handleDownloadSampleCsv}
                modalTitle={"segmentWizard.csvModal.title.importCustomStrings"}
            />
        </TabInnerContentContainer>
    );
};

export default CustomStringTab;
