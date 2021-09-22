import * as React from "react";
import { StatelessComponent, useState } from "react";
import { Injector } from "common/ioc/Injector";
import { trackEvent } from "../SWReactTableUtils";
import { allTrackers } from "services/track/track";
import { SWReactIcons } from "@similarweb/icons";
import { EditIcon } from "./KeywordGroupCell";
import { CustomCategoriesWizard } from "components/customCategoriesWizard/CustomCategoriesWizard";

export const CustomCategoryCell: StatelessComponent<any> = ({ row, value, metadata }) => {
    const [showCustomCategoriesWizard, setShowCustomCategoriesWizard] = useState(false);
    const editCategories = (categoryName, onSave, trackName) => {
        allTrackers.trackEvent(`Edit custom category`, "click", trackName, categoryName);
        setShowCustomCategoriesWizard(true);
    };
    return (
        <div className="folder-icon-cell">
            <SWReactIcons iconName="category" className="custom-category-icon" />
            <div className="folder-icon-cell-text-wrapper">
                <a
                    className="folder-icon-cell-text"
                    href={row.url}
                    title={value}
                    target="_self"
                    onClick={() => {
                        trackEvent(metadata, "Internal Link", value, "click");
                    }}
                >
                    {value}
                </a>
            </div>
            <div onClick={() => editCategories(value, metadata.onEdit, metadata.trackName)}>
                <EditIcon />
            </div>
            <CustomCategoriesWizard
                isOpen={showCustomCategoriesWizard}
                onClose={() => {
                    setShowCustomCategoriesWizard(false);
                }}
                wizardProps={{
                    stayOnPage: true,
                    customCategoryName: value,
                    onSave: async (modal) => {
                        const categoryName = "*" + modal.ctrl.categoryName;
                        const categoryInitialName = "*" + modal.ctrl.initialCategoryName;

                        await metadata.onEdit(categoryName, categoryInitialName);
                        setShowCustomCategoriesWizard(false);
                    },
                }}
            />
        </div>
    );
};
CustomCategoryCell.displayName = "CustomCategoryCell";
