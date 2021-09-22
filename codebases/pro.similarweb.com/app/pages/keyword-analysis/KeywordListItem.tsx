import * as React from "react";

let keywordListItem: any = ({ item, isEditable }) => {
    return (
        <span
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            className="list-item-text"
        >
            {item.text.toLowerCase()}
        </span>
    );
};

export const KeywordListItem = keywordListItem;
