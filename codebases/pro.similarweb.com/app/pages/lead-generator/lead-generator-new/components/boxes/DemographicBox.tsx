import React from "react";
import I18n from "components/React/Filters/I18n";
import { LeadGeneratorInfoIcon } from "../../../components/elements";
import LeadGeneratorTooltip from "../../../components/LeadGeneratorTooltip";
import {
    DemographicBoxWrapper,
    LeadGeneratorAgeTitle,
    LeadGeneratorGenderTitle,
    LeadGeneratorGenderWrapper,
    LeadGeneratorSectionTitle,
} from "../elements";
import DropdownCtrl from "../filters-ctrl/DropdownCtrl";
import SwitcherCtrl from "../filters-ctrl/SwitcherCtrl";
import {
    getOppositePercentDescription,
    getRangePercentDescription,
} from "../filters/RangePercentFilter";
import { IDesktopOnlyBoxProps } from "./DesktopOnlyBox";
import { createFilterBoxes } from "./FiltersBox";
import {
    isDesktopDevice,
    isFemaleFilter,
    isMaleFilter,
    isGroupFilter,
} from "pages/lead-generator/lead-generator-new/helpers";
import StyledFiltersBox from "pages/lead-generator/lead-generator-new/components/FiltersBox/StyledFiltersBox";
import { IRangePercentFilter } from "pages/lead-generator/LeadGeneratorFilters";
import { useTrack } from "components/WithTrack/src/useTrack";
import { useTranslation } from "components/WithTranslation/src/I18n";

const DemographicBox: React.FC<IDesktopOnlyBoxProps> = (props) => {
    const { filters, isActive, setActive, device, technologies } = props;
    const [track] = useTrack();
    const translate = useTranslation();
    const genderOptions = [
        "grow.lead_generator.new.demographic.gender_distribution.female",
        "grow.lead_generator.new.demographic.gender_distribution.male",
    ];

    const onGenderSelected = (index: number): void => {
        const gender = index === 0 ? "female" : "male";

        track("lead generation reports", "click", `demographics/gender/${gender}`);
    };

    const onToggle = (isOpen: boolean): void => {
        const action = isOpen ? "open" : "close";

        track("Drop down", action, "lead generation reports/demographics/age_group");
    };

    const onChangeAgeGroup = ({ id, type }): void => {
        track("Drop down", type, `lead generation reports/demographics/age_group/${id}`);
    };

    const ageGroupFilters = filters.filter(isGroupFilter);
    const femaleFilter = filters.find(isFemaleFilter);
    const maleFilter = filters.find(isMaleFilter);

    const [selectedGender, unselectedGender] = getGenderSelection(maleFilter, femaleFilter);

    const showSummary =
        femaleFilter.getValue() !== femaleFilter.initValue ||
        maleFilter.getValue() !== maleFilter.initValue;

    const filterSummary = `${translate(
        "grow.lead_generator.new.demographic.gender_distribution.summary",
        {
            // eslint-disable-next-line @typescript-eslint/camelcase
            gender_percent: `${getRangePercentDescription(
                selectedGender,
            ).toLowerCase()} ${translate(selectedGender.suffix).toLowerCase()}`,
        },
    )} (${getOppositePercentDescription(selectedGender).toLowerCase()} ${translate(
        unselectedGender.suffix,
    ).toLowerCase()})`;

    function getGenderSelection(
        maleFilter: IRangePercentFilter,
        femaleFilter: IRangePercentFilter,
    ): [IRangePercentFilter, IRangePercentFilter] {
        if (femaleFilter.getValue() !== femaleFilter.initValue) {
            return [femaleFilter, maleFilter];
        }

        return [maleFilter, femaleFilter];
    }

    return (
        <DemographicBoxWrapper>
            <StyledFiltersBox
                isActive={isActive}
                setActive={setActive}
                isDesktopOnly={isDesktopDevice(device)}
                {...props}
            >
                <LeadGeneratorSectionTitle>
                    <LeadGeneratorGenderTitle>
                        <I18n>
                            grow.lead_generator.new.demographic.section_title.gender_distribution
                        </I18n>
                    </LeadGeneratorGenderTitle>
                    <LeadGeneratorTooltip
                        text={translate(
                            "grow.lead_generator.new.demographic.section_title.gender_distribution.tooltip",
                        )}
                    >
                        <LeadGeneratorInfoIcon />
                    </LeadGeneratorTooltip>
                </LeadGeneratorSectionTitle>
                <LeadGeneratorGenderWrapper>
                    <SwitcherCtrl
                        firstFilter={femaleFilter}
                        secondFilter={maleFilter}
                        filtersOptions={genderOptions}
                        onChange={onGenderSelected}
                        title="grow.lead_generator.new.demographic.gender_distribution.title"
                    />
                    {createFilterBoxes(
                        [femaleFilter, maleFilter],
                        isActive,
                        setActive,
                        undefined,
                        technologies,
                    )}
                    {showSummary && <p>{filterSummary}</p>}
                </LeadGeneratorGenderWrapper>
                <LeadGeneratorAgeTitle>
                    <LeadGeneratorSectionTitle>
                        <I18n>
                            grow.lead_generator.new.demographic.section_title.age_distribution
                        </I18n>
                        <LeadGeneratorTooltip
                            text={translate(
                                "grow.lead_generator.new.demographic.section_title.age_distribution.tooltip",
                            )}
                        >
                            <LeadGeneratorInfoIcon />
                        </LeadGeneratorTooltip>
                    </LeadGeneratorSectionTitle>
                    <DropdownCtrl
                        filters={ageGroupFilters}
                        onToggle={onToggle}
                        onChange={onChangeAgeGroup}
                    />
                </LeadGeneratorAgeTitle>
                {createFilterBoxes(ageGroupFilters, isActive, setActive)}
            </StyledFiltersBox>
        </DemographicBoxWrapper>
    );
};

export default DemographicBox;
