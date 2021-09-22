import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import FiltersResetConfirmationModal from "../FiltersResetConfirmationModal/FiltersResetConfirmationModal";

type FiltersPanelSubmitCreateProps = {
    isClearButtonDisabled: boolean;
    isSaveButtonDisabled: boolean;
    onClearClick(): void;
    onSaveClick(): void;
};

const FiltersPanelSubmitCreate = (props: FiltersPanelSubmitCreateProps) => {
    const translate = useTranslation();
    const { isClearButtonDisabled, isSaveButtonDisabled, onClearClick, onSaveClick } = props;
    const [resetConfirmationModalOpened, setResetConfirmationModalOpened] = React.useState(false);

    const handleResetConfirm = () => {
        setResetConfirmationModalOpened(false);
        onClearClick();
    };

    const handleResetCancel = () => {
        setResetConfirmationModalOpened(false);
    };

    const handleResetClick = () => {
        setResetConfirmationModalOpened(true);
    };

    return (
        <>
            <FiltersResetConfirmationModal
                onCancel={handleResetCancel}
                onConfirm={handleResetConfirm}
                isOpened={resetConfirmationModalOpened}
            />
            <Button type="flat" onClick={handleResetClick} isDisabled={isClearButtonDisabled}>
                {translate("si.lead_gen_filters.button.clear")}
            </Button>
            <Button onClick={onSaveClick} isDisabled={isSaveButtonDisabled}>
                {translate("si.lead_gen_filters.button.save")}
            </Button>
        </>
    );
};

export default FiltersPanelSubmitCreate;
