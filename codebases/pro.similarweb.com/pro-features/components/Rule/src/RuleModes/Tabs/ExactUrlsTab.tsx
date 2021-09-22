import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { BooleanSearchInputWrap, Input } from "@similarweb/ui-components/dist/boolean-search";
import {
    BooleanSearchContainer,
    BooleanSearchWrapStyled,
    GradientWhiteTransparentCover,
    ImportFileBanner,
    ImportFileBannerText,
    ImportFileLink,
    InlineInputSection,
    SpanInputMeasure,
    TabInnerContentContainer,
    TabMessageContainer,
} from "../EditRule/EditRuleModeStyles";
import { ISite } from "components/Workspace/Wizard/src/types";
import { IRule } from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { ISegmentUrl } from "pages/segments/wizard/SegmentRulesStep/SegmentUrlList/SegmentUrlListTypes";
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
    onAddItems: (itemStringsObj: { exactURLS: string[] }) => void;
    onRemoveItems: (texts: string[]) => void;
    userSearchTerm?: string;
    hideUrlsPreview?: boolean;
    hasExistingUrlsCompundStringNoRobots: (segmentRules: IRule[]) => Promise<boolean>;
    isMidTierUser: boolean;
}

const ExactUrlsTab: React.FC<ICustomStringTabProps> = (props) => {
    const {
        index,
        userSearchTerm = "",
        segmentRules,
        onAddItems,
        onRemoveItems,
        isMidTierUser,
    } = props;

    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const [exactUrlsValue, setExactUrlsValue] = React.useState(userSearchTerm?.toLowerCase());
    const [exactUrlsInput, setExactUrlsInput] = React.useState(exactUrlsValue);
    const [applyWhenReady, setApplyWhenReady] = React.useState(false);
    const [isOpenImportModal, setIsOpenImportModal] = React.useState(false);
    const inputRef = React.useRef(null);
    const spanInputMeasureRef = React.useRef(null);
    const buttonsSectionRef = React.useRef(null);

    const hasUserInput = React.useMemo(() => {
        return exactUrlsValue && exactUrlsValue.trim().length > 0;
    }, [exactUrlsValue]);

    const onAddExactURLS = React.useCallback((exactURLS: string[]) => onAddItems({ exactURLS }), [
        onAddItems,
    ]);

    const onRemoveExactURLS = React.useCallback(onRemoveItems.bind(null, "exactURLS"), [
        onRemoveItems,
    ]);

    /**
     * Updates the user input.
     * This will trigger an update of the urls preview, by useEffect on the customStringValue.
     */
    const changeExactUrlsTimeoutRef = React.useRef(null);
    const changeExactUrlsValue = React.useCallback(
        (newExactUrlValue, immediate = false) => {
            newExactUrlValue = decodeURIComponent(newExactUrlValue)
                ?.replace("http://www.", "")
                ?.replace("https://www.", "")
                ?.replace("http://", "")
                ?.replace("https://", "");
            const updateExactUrlsValue = () => {
                setExactUrlsValue(newExactUrlValue);
            };

            setExactUrlsInput(newExactUrlValue);
            clearTimeout(changeExactUrlsTimeoutRef.current);
            if (immediate) {
                updateExactUrlsValue();
            } else {
                changeExactUrlsTimeoutRef.current = setTimeout(
                    updateExactUrlsValue,
                    UPDATE_PREVIEW_DEBOUNCE,
                );
            }
        },
        [setExactUrlsInput, exactUrlsValue],
    );

    const handleExactUrlsInput = React.useCallback(
        (evt) => {
            changeExactUrlsValue(evt.target.value);
        },
        [changeExactUrlsValue],
    );

    const handleExactUrlKeyUp = React.useCallback(
        (evt) => {
            switch (evt.key) {
                case "Enter":
                    setApplyWhenReady(true);
                    changeExactUrlsValue(evt.target.value, true);
                    break;
                case "Escape":
                    changeExactUrlsValue("", true);
                    break;
                default:
                    break;
            }
        },
        [changeExactUrlsValue, setApplyWhenReady],
    );

    const handleApply = React.useCallback(async () => {
        // prevent adding a word when in progress or no urls
        if (!hasUserInput) {
            return;
        }

        onAddExactURLS([exactUrlsValue]);

        // Reset user input to the initial state
        changeExactUrlsValue("", true);
    }, [exactUrlsValue, onAddExactURLS, changeExactUrlsValue]);

    const openImportFileModal = React.useCallback(() => {
        setIsOpenImportModal(true);
    }, []);

    const closeImportFileModal = React.useCallback(() => {
        setIsOpenImportModal(false);
    }, []);

    const handleImportStrings = React.useCallback(
        (strings) => {
            onAddExactURLS(strings);
        },
        [onAddExactURLS],
    );

    // Note: apply the current custom string when flag is true  and urls preview is ready
    React.useEffect(() => {
        if (applyWhenReady) {
            setApplyWhenReady(false);
            handleApply();
        }
    }, [applyWhenReady]);

    // calculate input text width to place the ADD button just afterwards.
    React.useLayoutEffect(() => {
        spanInputMeasureRef.current.textContent = exactUrlsInput;
        const textContentWidth = spanInputMeasureRef.current.offsetWidth;
        const posLeft = exactUrlsInput
            ? Math.min(textContentWidth, inputRef.current.offsetWidth) // place after text or max at the end of input
            : inputRef.current.offsetWidth; // if empty then place at the end of input
        buttonsSectionRef.current.style.left = `${posLeft}px`;
        buttonsSectionRef.current.style.paddingRight = `${
            inputRef.current.offsetWidth - posLeft
        }px`; // pad right to the button to avoid input click
    }, [exactUrlsInput]);

    const handleDownloadSampleCsv = React.useCallback((event: any) => {
        TrackWithGuidService.trackWithGuid(
            "segment.wizard.exact.urls.upload.file.modal.download.csv.sample.file",
            "click",
        );
    }, []);
    return (
        <TabInnerContentContainer>
            <ImportFileBanner>
                <ImportFileBannerText>
                    {services.i18n("segmentWizard.editRule.exact.urls.modal.desc.importStrings")}
                </ImportFileBannerText>
                <ImportFileLink onClick={openImportFileModal}>
                    <SWReactIcons iconName="download" size="xs" />
                    {services.i18n("segmentWizard.editRule.exact.urls.modal.button.importStrings")}
                </ImportFileLink>
            </ImportFileBanner>
            <BooleanSearchContainer>
                <BooleanSearchWrapStyled>
                    <SWReactIcons size="sm" iconName="add" />
                    <BooleanSearchInputWrap>
                        <Input
                            ref={inputRef}
                            placeholder={services.i18n(
                                "segmentWizard.editRule.exact.urls.modal.input",
                            )}
                            value={exactUrlsInput}
                            onChange={isMidTierUser ? noop : handleExactUrlsInput}
                            onKeyUp={isMidTierUser ? noop : handleExactUrlKeyUp}
                            autoFocus={!isMidTierUser}
                        />
                        <SpanInputMeasure ref={spanInputMeasureRef} />
                        <InlineInputSection ref={buttonsSectionRef}>
                            {exactUrlsInput && (
                                <Button
                                    className="inlineButton"
                                    type="outlined"
                                    onClick={handleApply}
                                    isLoading={false}
                                    isDisabled={!hasUserInput}
                                >
                                    {services.i18n(
                                        "segmentWizard.editRule.custom.string.modal.button",
                                    )}
                                </Button>
                            )}
                        </InlineInputSection>
                    </BooleanSearchInputWrap>
                </BooleanSearchWrapStyled>
            </BooleanSearchContainer>
            {segmentRules[index].exactURLS.length > 0 && (
                <RuleSelectedStringsRow
                    stringsList={segmentRules[index].exactURLS}
                    title={services.i18n("segmentWizard.editRule.exact.urls.row.title")}
                    onRemoveStrings={onRemoveExactURLS}
                />
            )}
            {isMidTierUser && <GradientWhiteTransparentCover />}
            <ImportCSVModal
                isOpen={isOpenImportModal}
                onClose={closeImportFileModal}
                onImportSuccess={handleImportStrings}
                onDownloadSampleCsvClick={handleDownloadSampleCsv}
                modalTitle={"segmentWizard.csvModal.title.importExactUrls"}
            />
        </TabInnerContentContainer>
    );
};

export default ExactUrlsTab;
