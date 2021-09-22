import * as React from "react";
import I18n from "../Filters/I18n";
export const AddItemInputTitle = ({ itemsListType }) => {
    return (
        <p style={{ margin: 0, position: "absolute", top: 11, zIndex: 1 }}>
            <b>
                <I18n>KeywordAnalysis.keywordgroup.wizard.enter</I18n>
            </b>{" "}
            /{" "}
            <b>
                <I18n>KeywordAnalysis.keywordgroup.wizard.paste</I18n>
            </b>
            <I18n>KeywordAnalysis.keywordgroup.wizard.one.or.more</I18n> {itemsListType}
        </p>
    );
};
