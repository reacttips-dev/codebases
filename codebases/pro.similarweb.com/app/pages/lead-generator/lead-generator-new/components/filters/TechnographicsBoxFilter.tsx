import _ from "lodash";
import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { SimpleChipItem, TechnographicsChipItem } from "@similarweb/ui-components/dist/chip";
import {
    CheckboxIcon,
    Dropdown,
    DropdownButton,
    EllipsisDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { RadioContainer } from "@similarweb/ui-components/dist/radio-button/styles/StyledComponent";
import { swSettings } from "common/services/swSettings";
import LocationService from "components/Modals/src/UnlockModal/LocationService";
import { WorkspaceContext } from "pages/workspace/common components/WorkspaceContext";
import { openUnlockModal } from "services/ModalService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled, { css } from "styled-components";

import { DefaultItem } from "components/BoxSubtitle/src/BoxSubtitle";
import { i18nFilter } from "filters/ngFilters";
import I18n from "../../../../../components/React/Filters/I18n";
import LeadGeneratorChips from "../../../components/LeadGeneratorChips";
import { FilterDescription, FunctionalFlagFilterWrapper } from "../elements";
import { DefaultSummary } from "../summary/DefaultSummary";
import { getChipsSummaryDescription } from "./ChipsFilter";
import { IBoxFilterProps } from "./types";

// TODO: Refactor, extract

export interface IContainerProps {
    active: boolean;
}

const DROPDOWN_TYPE_TECHNOLOGIES = "technologies";
const DROPDOWN_TYPE_CATEGORIES = "categories";

const trackinEventName = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    technographics_included: "Technologies Used",
    // eslint-disable-next-line @typescript-eslint/camelcase
    technographics_excluded: "Technologies Not Used",
};

const trackinEventSubname = {
    technologies: "technology",
    categories: "tech category",
};

export const Container = styled.div<IContainerProps>`
    display: flex;
    height: 48px;
    font-family: Roboto;
    font-size: 14px;
    color: ${colorsPalettes.carbon["500"]};
    letter-spacing: 0.2px;
    align-items: center;
    padding: 0 11px 0 16px;
    box-sizing: border-box;
    cursor: pointer;
    ${({ active }) =>
        active &&
        css`
            background-color: rgba(42, 62, 82, 0.05);
        `}
`;

export const ItemText: any = styled.span<{ isChild: boolean }>`
    margin-left: 8px;
    color: ${colorsPalettes.carbon[500]};
    font-weight: ${({ isChild }) => (isChild ? 400 : 500)};
    text-transform: capitalize;
`;

const CheckboxIconStyled = styled(CheckboxIcon)`
    flex-shrink: 0;
`;

interface IStyledContainer {
    onClick: (e) => void;
    onMouseEnter: (e) => void;
    "data-automation": string;
    "data-automation-selected": boolean;
    active: boolean;
    selected: boolean;
    mode: string;
    isChild: boolean;
    isMaxLimitItemCount: boolean;
    className: string;
}

const isItemDisabled = ({ isMaxLimitItemCount, isChild, mode, selected }) => {
    if (selected) {
        return false;
    } else if (isMaxLimitItemCount) {
        return true;
    } else if (mode === DROPDOWN_TYPE_TECHNOLOGIES) {
        return !isChild;
    }
    return false;
};

const isItemGrayedOut = (props) => {
    const { isChild, mode } = props;
    const isDisabled = isItemDisabled(props);
    if (mode === DROPDOWN_TYPE_TECHNOLOGIES && !isChild) {
        return true;
    }
    return isDisabled;
};

const StyledContainer = styled(Container)<IStyledContainer>`
  ${({ selected }) =>
      selected &&
      css`
          background-color: ${rgba(colorsPalettes.carbon[500], 0.05)};
      `}
  ${(props: any) =>
      isItemDisabled(props) &&
      css`
          pointer-events: none;
      `}

  ${(props) =>
      isItemGrayedOut(props) &&
      css`
          ${ItemText} {
              color: ${rgba(colorsPalettes.carbon[500], 0.4)};
          }
          ${CheckboxIconStyled} path {
              fill-opacity: 0.4;
          }
      `}
`;

const ChildIconContainer = styled.div.attrs(() => ({
    className: "ItemIcon ItemIcon--website",
}))`
    width: 24px;
    height: 24px;
    margin-left: 33px;
`;

const ChildIconImage = styled.div`
  border-radius: 3px;
  align-self: center;
  width:16px;
  height:16px;
  background-size:contain;
  background-repeat:no-repeat;
  background-position:center;
  background-image: url('${(props) =>
      `https://www.similartech.com/images/technology?id=${props.id}`}');
`;

const ChildIcon = ({ id }) => (
    <ChildIconContainer>
        <ChildIconImage id={id} />
    </ChildIconContainer>
);

const LockIcon = styled(SWReactIcons).attrs(() => ({
    iconName: "locked",
    size: "sm",
}))`
    display: flex;
    margin-left: auto;
`;

export const MultiSelectTechnologyDropdownItem: React.FC<any> = ({
    // TODO: Proper type
    mutableRefObject,
    isLocked,
    selected,
    partiallySelected,
    mode,
    id,
    text,
    children,
    icon,
    onClick,
    onMouseHover,
    active,
    isChild,
    className,
}) => {
    const isMaxLimitItemCount = !mutableRefObject.current.canAddMoreItems();
    return (
        <StyledContainer
            onClick={onClick}
            onMouseEnter={onMouseHover}
            data-automation={`dd-item`}
            data-automation-selected={!!selected}
            active={active}
            selected={selected}
            mode={mutableRefObject.current.mode}
            isChild={isChild}
            isMaxLimitItemCount={isMaxLimitItemCount}
            className={className}
        >
            {isChild ? <ChildIcon id={id} /> : <SWReactIcons iconName="folder" size="sm" />}
            <ItemText isChild={isChild}>
                {text} {!!children.length && `(${children.length})`}
            </ItemText>
            {mode === DROPDOWN_TYPE_TECHNOLOGIES && !isChild ? (
                false
            ) : isLocked ? (
                <LockIcon />
            ) : (
                <CheckboxIconStyled selected={selected} halfSelected={partiallySelected} />
            )}
        </StyledContainer>
    );
};

const dropdownButtonTexts = {
    technologies: "grow.lead_generator.new.general.technographics.dropdown.technologies",
    categories: "grow.lead_generator.new.general.technographics.dropdown.categories",
};

const summaryTexts = {
    include: {
        technologies: "grow.lead_generator.new.general.technographics.summary.include.technologies",
        categories: "grow.lead_generator.new.general.technographics.summary.include.categories",
    },
    exclude: {
        technologies: "grow.lead_generator.new.general.technographics.summary.exclude.technologies",
        categories: "grow.lead_generator.new.general.technographics.summary.exclude.categories",
    },
};

const technologiesPlaceholder = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    technographics_included: "grow.lead_generator.new.general.technologies.placeholder.include",
    // eslint-disable-next-line @typescript-eslint/camelcase
    technographics_excluded: "grow.lead_generator.new.general.technologies.placeholder.exclude",
};

const flagFilterTitle = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    technographics_included:
        "grow.lead_generator.new.general.technographics.filter.box.include.title",
    // eslint-disable-next-line @typescript-eslint/camelcase
    technographics_excluded:
        "grow.lead_generator.new.general.technographics.filter.box.exclude.title",
};

export const Expand = styled.div`
    flex-grow: 1;
`;

const dropDownItems = [
    <EllipsisDropdownItem
        id={DROPDOWN_TYPE_TECHNOLOGIES}
        key={DROPDOWN_TYPE_TECHNOLOGIES}
        disabled={false}
    >
        <I18n>{dropdownButtonTexts.technologies}</I18n>
    </EllipsisDropdownItem>,
    <EllipsisDropdownItem
        id={DROPDOWN_TYPE_CATEGORIES}
        key={DROPDOWN_TYPE_CATEGORIES}
        disabled={false}
    >
        <I18n>{dropdownButtonTexts.categories}</I18n>
    </EllipsisDropdownItem>,
];
const Gap = styled.div`
    margin-bottom: 10px;
`;

const TechnographicsWrapper = styled.div<{ disabled: boolean }>`
    ${(props) =>
        props.disabled &&
        css`
            .DropdownButton {
                background-color: #f4f5f6;
                color: rgba(42, 62, 82, 0.4);
                border: 1px solid #e9ebed;
            }
        `}
    ${RadioContainer} {
        pointer-events: initial;
        cursor: pointer;
        label {
            cursor: inherit;
        }
    }

    .technographics-box-chips-container {
        margin-top: 10px;
    }
`;

const TechnographicsDropdownDescription = styled.div`
    line-height: 20px;
    display: flex;
    align-items: center;
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
`;

interface IMutableRefObject {
    current: {
        mode: string;
        canAddMoreItems(): boolean;
    };
}

interface ICategory {
    technology: string;
    description: string;
    technologyId: string;
}

interface ICategories {
    [key: string]: {
        subCategories: {
            [key: string]: ICategory[];
        };
    };
}

export interface ICategoriesResponse {
    categories: ICategories;
}

function traverseTechnologiesListToDropdownItems(categories: ICategories) {
    return Object.entries(categories)
        .sort(([categoryA], [CategoryB]) => {
            if (categoryA.toLowerCase() < CategoryB.toLowerCase()) {
                return -1;
            } else if (categoryA.toLowerCase() > CategoryB.toLowerCase()) {
                return 1;
            }
            return 0;
        })
        .flatMap(([category, { subCategories }]) => {
            const parentItem = {
                category,
                text: category,
                id: category,
                isChild: false,
                children: [],
                parentItem: null,
            };
            const children = Object.values(subCategories)
                .flat()
                .map(({ technology, description, technologyId: id }) => ({
                    technology,
                    description,
                    id,
                    text: technology,
                    isChild: true,
                    children: [],
                    category,
                    parentItem,
                }));
            const sortedChildren = _.sortBy(children, [
                ({ technology }) =>
                    typeof technology === "string" ? technology.toLowerCase().trim() : Infinity,
            ]);
            parentItem.children = sortedChildren;
            return [parentItem, ...sortedChildren];
        });
}

const useTechnologiesList = () => {
    const [items, setItems] = React.useState([]);
    const context = React.useContext(WorkspaceContext);
    React.useEffect(() => {
        async function fetchData() {
            const { categories } = await context.fetchTechnologies();
            if (categories) {
                setItems(traverseTechnologiesListToDropdownItems(categories));
            }
        }

        fetchData();
    }, []);
    return items;
};

export const TechnographicsBoxFilter: React.FunctionComponent<IBoxFilterProps> = (props) => {
    const { filter, setBoxActive, isActive, technologies = { categories: {} } } = props;
    const { mode, values } = filter.getValue();
    const [term, setTerm] = React.useState("");
    const isLocked = !swSettings.components.Workspaces.resources.Technographics;
    const mutableRefObject: IMutableRefObject = React.useRef({
        mode,
        canAddMoreItems,
    });
    const technologiesList = traverseTechnologiesListToDropdownItems(technologies.categories);
    const items = React.useMemo(() => getFreshItemList(term, mode), [term, mode, technologiesList]);
    const setValue = (val) => {
        filter.setValue(val);
        setBoxActive(true);
    };

    function canAddMoreItems() {
        return mode === DROPDOWN_TYPE_CATEGORIES || values.length < 40;
    }

    function getFreshItemList(term, mode) {
        let allItems = technologiesList;
        if (mode === DROPDOWN_TYPE_CATEGORIES) {
            allItems = allItems.filter(({ isChild }) => !isChild);
        }
        const searchTermAppearsInItem = (item) =>
            item.text.trim().toLowerCase().includes(term.trim().toLowerCase());
        const retItems = allItems.reduce((items, item) => {
            const searchTermAppearsInMyText = !term || searchTermAppearsInItem(item);
            const isParent = !item.isChild;
            if (isParent) {
                if (searchTermAppearsInMyText) {
                    return [
                        ...items,
                        <MultiSelectTechnologyDropdownItem
                            mode={mode}
                            key={item.text}
                            {...item}
                            isLocked={isLocked}
                            mutableRefObject={mutableRefObject}
                        />,
                    ];
                }
                const searchTermAppearsInAnyOfMyChildren = item.children.some((child) =>
                    searchTermAppearsInItem(child),
                );
                if (searchTermAppearsInAnyOfMyChildren) {
                    return [
                        ...items,
                        <MultiSelectTechnologyDropdownItem
                            mode={mode}
                            key={item.text}
                            {...item}
                            isLocked={isLocked}
                            mutableRefObject={mutableRefObject}
                        />,
                    ];
                } else {
                    return items;
                }
            } else {
                if (searchTermAppearsInMyText) {
                    return [
                        ...items,
                        <MultiSelectTechnologyDropdownItem
                            mode={mode}
                            mutableRefObject={mutableRefObject}
                            key={item.text}
                            isLocked={isLocked}
                            {...item}
                        />,
                    ];
                }
                const searchTermAppearsInParentItem = searchTermAppearsInItem(item.parentItem);
                if (searchTermAppearsInParentItem) {
                    return [
                        ...items,
                        <MultiSelectTechnologyDropdownItem
                            mode={mode}
                            mutableRefObject={mutableRefObject}
                            key={item.text}
                            isLocked={isLocked}
                            {...item}
                        />,
                    ];
                } else {
                    return items;
                }
            }
        }, []);

        return retItems;
    }

    function getDropDownProps() {
        return {
            shouldScrollToSelected: false,
            virtualize: true,
            disabled: false,
            searchPlaceHolder: i18nFilter()(
                `grow.lead_generator.chips.search_placeHolder.technographics.${mode}`,
            ),
            getItems: (p, { term: currentTerm }) => {
                if (currentTerm !== term) {
                    setTimeout(() => {
                        setTerm(currentTerm);
                    });
                    return getFreshItemList(currentTerm, mode);
                }
                return items;
            },
        };
    }

    function getDropDownButtonProps() {
        return {
            disabled: false,
        };
    }

    function setValues(values, item) {
        setBoxActive(true);
        const unlockHook = {
            modal: "TechnologiesList",
            slide: "TechnologiesList",
        };
        const location = `${LocationService.getCurrentLocation()}`;

        if (!isLocked) {
            const action = values.some(({ id }) => id === item.id) ? "add" : "remove";

            TrackWithGuidService.trackWithGuid("technographics.filter.changeitem", "click", {
                eventName: trackinEventName[filter.stateName],
                action,
                eventSubname: trackinEventSubname[mode],
                eventSubSubname: item.text,
            });

            return setValue({
                [filter.stateName]: {
                    ...filter.getValue(),
                    values,
                },
            });
        }
        openUnlockModal(unlockHook, location);
    }

    function setMode({ id: mode }) {
        if (mode !== filter.getValue().mode) {
            TrackWithGuidService.trackWithGuid("technographics.filter.mode", "click", {
                name: trackinEventName[filter.stateName],
                typeDropdownMode: mode,
            });

            setValue({
                [filter.stateName]: {
                    ...filter.getValue(),
                    values: [],
                    mode,
                },
            });
        }
    }

    const placeHolder =
        mode === DROPDOWN_TYPE_CATEGORIES
            ? i18nFilter()("grow.lead_generator.new.general.categories.placeholder")
            : i18nFilter()(technologiesPlaceholder[filter.stateName]);

    const isEmpty = !values.length;
    mutableRefObject.current.mode = mode;
    mutableRefObject.current.canAddMoreItems = canAddMoreItems;

    return (
        <TechnographicsWrapper disabled={!isActive}>
            <FunctionalFlagFilterWrapper>
                <TechnographicsDropdownDescription>
                    <I18n>{flagFilterTitle[filter.stateName]}</I18n>
                </TechnographicsDropdownDescription>
                <Expand>
                    <Dropdown onClick={setMode} selectedIds={{ [mode]: true }}>
                        {[
                            <DropdownButton key="DropdownButton1">
                                <I18n>{dropdownButtonTexts[mode]}</I18n>
                            </DropdownButton>,
                            ...dropDownItems,
                        ]}
                    </Dropdown>
                </Expand>
            </FunctionalFlagFilterWrapper>
            {!isEmpty && <Gap />}
            <div className="technographics-box-chips-container">
                <LeadGeneratorChips
                    key={mode}
                    value={values}
                    onChange={setValues}
                    items={items}
                    placeholder={placeHolder}
                    type={DROPDOWN_TYPE_TECHNOLOGIES}
                    getDropDownProps={getDropDownProps}
                    getDropDownButtonProps={getDropDownButtonProps}
                    ChipsComponent={
                        mode === DROPDOWN_TYPE_TECHNOLOGIES
                            ? TechnographicsChipItem
                            : SimpleChipItem
                    }
                />
            </div>
        </TechnographicsWrapper>
    );
};

const TechnographicsSummaryStyled = styled(DefaultSummary)<{
    functionality: string;
    title: string;
    description: string;
    className?: string;
}>`
    ${FilterDescription} {
        :before {
            text-transform: capitalize;
            font-weight: 600;
        }
        text-transform: capitalize;
    }
`;

export const TechnographicsSummary = ({ filter }) => {
    let title = "";
    const { mode, functionality } = filter.getValue();

    switch (mode) {
        case DROPDOWN_TYPE_TECHNOLOGIES:
            title = summaryTexts[functionality].technologies;
            break;
        case DROPDOWN_TYPE_CATEGORIES:
            title = summaryTexts[functionality].categories;
            break;
    }
    return (
        <TechnographicsSummaryStyled
            title={title}
            functionality={filter.getValue().functionality}
            description={getChipsSummaryDescription(filter.getValue().values)}
        />
    );
};

const FunctionalityDescription = styled(DefaultItem)`
    margin-right: 0 !important;
`;
const TechnographicsFilterDescription = styled.span`
    margin-left: 4px;
`;

export const getTechnographicsReportResultSubtitle = ({
    filter,
    index,
    isFirst,
    className,
    filters,
}) => {
    const { values, functionality, mode } = filter;
    let title = "";

    switch (mode) {
        case DROPDOWN_TYPE_TECHNOLOGIES:
            title = summaryTexts[functionality].technologies;
            break;
        case DROPDOWN_TYPE_CATEGORIES:
            title = summaryTexts[functionality].categories;
            break;
    }

    return (
        <>
            <FunctionalityDescription>
                {i18nFilter()(title)}
                {":"}
            </FunctionalityDescription>
            {values.map(({ text }, index) => (
                <TechnographicsFilterDescription key={text}>
                    {_.capitalize(text)}
                    {index === values.length - 1 ? <>&nbsp;&nbsp;&nbsp;</> : ","}
                </TechnographicsFilterDescription>
            ))}
        </>
    );
};

export const getReportValue = (filterState, allState) => {
    const { mode, functionality, values } = filterState;
    let activeField = "";

    switch (mode) {
        case DROPDOWN_TYPE_TECHNOLOGIES:
            activeField = "technographics_technology";
            break;
        case DROPDOWN_TYPE_CATEGORIES:
            activeField = "technographics_parent_category";
            break;
    }
    return {
        [activeField]: values.map(({ text }) => text.trim()),
        toClientData: () => ({ ...filterState }),
    };
};
