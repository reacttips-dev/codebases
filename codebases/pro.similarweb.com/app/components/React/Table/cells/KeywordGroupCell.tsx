import { FC, useState } from "react";
import { Injector } from "common/ioc/Injector";
import { trackEvent } from "../SWReactTableUtils";
import { allTrackers } from "services/track/track";
import { SWReactIcons } from "@similarweb/icons";
import { KeywordsGroupEditorModal } from "pages/keyword-analysis/KeywordsGroupEditorModal";
import styled from "styled-components";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export const EditIcon = styled(SWReactIcons).attrs({
    iconName: "edit-icon",
    className: "edit-icon",
})`
    svg {
        path {
            fill: #4e8cf9;
        }
    }
`;

export const KeywordGroupCell: FC<any> = ({ row, value, metadata }) => {
    const [keywordGroupToEdit, setKeywordGroupToEdit] = useState<any>();
    const [isOpen, setIsOpen] = useState<boolean>();

    const editKeywordGroups = (groupName, trackName) => {
        allTrackers.trackEvent(`Edit Keyword Group`, "click", trackName, groupName);
        const group = keywordsGroupsService.findGroupByName(groupName);

        setKeywordGroupToEdit(group);
        setIsOpen(true);
    };

    return (
        <>
            <div className="folder-icon-cell">
                <SWReactIcons iconName="keyword-group" className="keyword-group-icon" />
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
                <div onClick={() => editKeywordGroups(value, metadata.trackName)}>
                    <EditIcon />
                </div>
            </div>
            <KeywordsGroupEditorModal
                onClose={() => setIsOpen(false)}
                open={isOpen}
                keywordsGroup={keywordGroupToEdit}
                onSave={metadata.onEdit}
            />
        </>
    );
};
KeywordGroupCell.displayName = "KeywordGroupCell";
