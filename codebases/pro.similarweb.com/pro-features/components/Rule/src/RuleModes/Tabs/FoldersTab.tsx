import {
    BooleanSearchWrapStyled,
    CheckBoxContainer,
    NoDataContainer,
    TabInnerContentContainer,
    TextAlign,
    DEFAULT_CHIPS_CONTAINER_HEIGHT,
    BooleanSearchContainer,
} from "../EditRule/EditRuleModeStyles";
import React, { FunctionComponent, useMemo, useState } from "react";
import { SWReactIcons } from "@similarweb/icons";
import noop from "lodash/noop";
import { BooleanSearchInputWrap, Input } from "@similarweb/ui-components/dist/boolean-search";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { connect } from "react-redux";
import { i18nFilter } from "filters/ngFilters";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { RadioButton } from "@similarweb/ui-components/dist/radio-button";
import { IFolderPredictions, IRule } from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { RuleSelectedStringsRow } from "components/Rule/src/RuleModes/EditRule/EditRuleComponents/RuleSelectedStringsRow";

const MAX_SHOWN_FOLDERS = 300;

interface IFoldersTab {
    onAddItems: (itemStringsObj: { folders: string[] }) => void;
    onRemoveItems: (ruleIndex: number, folders: string[]) => void;
    onUpdateItem: (rule: IRule) => void;
    rule: IRule;
    folderPredictionsLoading: boolean;
    folderPredictions: IFolderPredictions;
    isMidTierUser: boolean;
}

const FoldersTab: FunctionComponent<IFoldersTab> = (props) => {
    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    /**
     * Filter out words when editing a rule. (filter out word prediction chips)
     */
    const [searchFoldersFilterValue, setSearchFoldersFilterValue] = useState<string>("");
    const inputPlaceholder = services.i18n(
        "workspaces.segment.wizard.input_search.folders.placeholder",
    );
    const {
        onAddItems,
        onRemoveItems,
        rule,
        isMidTierUser,
        onUpdateItem,
        folderPredictions,
        folderPredictionsLoading,
    } = props;

    const onAddFolders = React.useCallback((folders: string[]) => onAddItems({ folders }), [
        onAddItems,
    ]);

    const onRemoveFolders = React.useCallback(onRemoveItems.bind(null, "folders"), [onRemoveItems]);

    const onFilterChange = (event) => {
        setSearchFoldersFilterValue(event?.currentTarget?.value?.trim());
    };
    const filteredFolderPredictions = useMemo(() => {
        const filtered = searchFoldersFilterValue
            ? folderPredictions?.Data.filter((val) => {
                  return val.toLowerCase().indexOf(searchFoldersFilterValue.toLowerCase()) !== -1;
              })
            : folderPredictions?.Data;
        return filtered?.slice(0, MAX_SHOWN_FOLDERS);
    }, [folderPredictions, searchFoldersFilterValue]);
    const OnCheckBoxToggle = (event): void => {
        const value = event?.currentTarget?.innerText;
        rule.folders.includes(value) ? onRemoveFolders([value]) : onAddFolders([value]);
    };

    const onRadioClick = (event): void => {
        const value = event?.currentTarget?.innerText;
        if (rule.folders.includes(value)) {
            onRemoveFolders([value]);
        } else {
            onUpdateItem({ ...rule, folders: [value] });
        }
    };

    const renderCheckboxItems = () => {
        return filteredFolderPredictions?.map((value) => {
            return (
                <CheckBoxContainer key={value}>
                    {isMidTierUser ? (
                        <RadioButton
                            itemLabel={value}
                            itemSelected={rule.folders.includes(value)}
                            className={"folders"}
                            onClick={onRadioClick}
                            key={value}
                        />
                    ) : (
                        <Checkbox
                            key={value}
                            className={["folders"]}
                            selected={rule.folders.includes(value)}
                            label={value}
                            onClick={OnCheckBoxToggle}
                        />
                    )}
                </CheckBoxContainer>
            );
        });
    };

    const renderNoSearchData = () => {
        return (
            <NoDataContainer>
                <TextAlign>
                    {services.i18n("segmentWizard.editRule.folders.no.results.part1")}
                </TextAlign>
                <TextAlign>
                    {services.i18n("segmentWizard.editRule.folders.no.results.part2")}
                </TextAlign>
            </NoDataContainer>
        );
    };

    return (
        <TabInnerContentContainer>
            <BooleanSearchContainer>
                <BooleanSearchWrapStyled>
                    <BooleanSearchInputWrap>
                        <SWReactIcons size="sm" iconName={"search"} />
                        <Input
                            value={searchFoldersFilterValue}
                            onKeyUp={noop}
                            onChange={onFilterChange}
                            placeholder={inputPlaceholder}
                            autoFocus={true}
                        />
                        {folderPredictionsLoading && <DotsLoader />}
                    </BooleanSearchInputWrap>
                </BooleanSearchWrapStyled>
            </BooleanSearchContainer>
            {searchFoldersFilterValue && filteredFolderPredictions.length === 0 ? (
                renderNoSearchData()
            ) : (
                <ScrollArea
                    style={{ height: DEFAULT_CHIPS_CONTAINER_HEIGHT, zIndex: 99 }}
                    verticalScrollbarStyle={{ borderRadius: 5 }}
                >
                    {renderCheckboxItems()}
                </ScrollArea>
            )}
            {rule.folders.length > 0 && (
                <RuleSelectedStringsRow
                    stringsList={rule.folders}
                    title={services.i18n("segmentWizard.editRule.folders.row.title")}
                    onRemoveStrings={onRemoveFolders}
                />
            )}
        </TabInnerContentContainer>
    );
};

function mapStateToProps({
    segmentsWizardModule: { folderPredictionsLoading, folderPredictions },
}) {
    return {
        folderPredictionsLoading,
        folderPredictions,
    };
}
export default connect(mapStateToProps)(FoldersTab);
