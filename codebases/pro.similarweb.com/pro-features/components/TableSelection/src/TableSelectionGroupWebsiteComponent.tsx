import React, {
    ForwardRefRenderFunction,
    useState,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import styled, { css } from "styled-components";
import { i18nFilter } from "filters/ngFilters";
import { IProModalCustomStyles, ProModal } from "components/Modals/src/ProModal";
import { ModalTableSelectionNewGroup } from "./ModalTableSelectionNewGroup";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { ECategoryType } from "common/services/categoryService.types";
import { ETableSelectionNewGroupDropdownMode } from "./TableSelectionNewGroupDropdown";
import { TableSelectionKeywordsWarning } from "./TableSelectionKeywordsWarning";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { successArt } from "./successArt";
import {
    KeywordGeneratorToolPageModalContainer,
    KeywordGeneratorToolPageModalHeader,
    KeywordGeneratorToolPageModalBody,
    KeywordGeneratorToolPageModalFooter,
    ButtonContainer,
} from "pages/keyword-analysis/keyword-generator-tool/styledComponents";
interface ITableSelectionGroupWebsiteComponentProps {
    onNewListButtonClick: VoidFunction;
    onCancel: VoidFunction;
    isCreateNewListModalOpen: boolean;
    isLoading: boolean;
    newGroupNameLabel: string;
    appendTo: string;
    groupIconName: string;
    groups: Array<{ id: string; text: string }>;
    onGroupClick: (item: { id: string; text: string }) => void;
    onSubmit: (name: string) => void;
    error: boolean;
    errorMessage: string;
    onListTypeSelect: (typeId) => void;
    selectedListType: ECategoryType;
    mode: ETableSelectionNewGroupDropdownMode;
    newGroupItemText: string;
    currentGroup: string;
    allItemsExistsMessage: string;
    maxItemsMessage: string;
    count: number;
    linkToGroup: string;
}
const scrollAreaHeight = 256 - 48 - 8 * 2;
const TableSelectionGroupWebsiteComponentWrap = styled.div`
    display: flex;
    & > button:first-child {
        margin-right: 10px;
    }
`;
const proModalStyles: IProModalCustomStyles = {
    content: {
        boxSizing: "border-box",
        width: "400px",
        padding: 0,
    },
};
const ItemStyled = styled(EllipsisDropdownItem)<any>`
    padding: 0 18px;
    margin-bottom: 1px;
    position: relative;
    ${({ appendSeparator }) =>
        appendSeparator &&
        css`
            &:after {
                content: "";
                width: calc(100% - 16px);
                height: 1px;
                background-color: ${colorsPalettes.carbon[100]};
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
            }
        `}
    ${({ disableHover }) =>
        disableHover &&
        css`
            &:hover {
                background-color: inherit;
                cursor: default;
            }
        `}
`;
const KeywordGeneratorToolPageModalContainerWithPadding = styled(
    KeywordGeneratorToolPageModalContainer as any,
)`
    padding: 20px 16px;
`;
interface ITableSelectionGroupWebsiteComponentWrap {
    close: VoidFunction;
}
const TableSelectionGroupWebsiteComponentRenderFunction: ForwardRefRenderFunction<
    ITableSelectionGroupWebsiteComponentWrap,
    ITableSelectionGroupWebsiteComponentProps
> = (props, ref) => {
    const i18n = i18nFilter();
    const {
        onNewListButtonClick,
        isCreateNewListModalOpen,
        newGroupNameLabel,
        onCancel: onCancelProp,
        appendTo,
        groups,
        groupIconName,
        onGroupClick,
        isLoading,
        onSubmit: onSubmitProp,
        error,
        errorMessage,
        onListTypeSelect,
        selectedListType,
        mode,
        currentGroup,
        newGroupItemText,
        maxItemsMessage,
        allItemsExistsMessage,
        count,
        linkToGroup,
    } = props;
    const [groupName, setGroupName] = useState("");
    const popupEl = useRef(null);
    const onCancel = () => {
        setGroupName("");
        onCancelProp();
    };
    useImperativeHandle(ref, () => ({
        close: () => {
            popupEl.current.closePopup();
        },
    }));
    const onGroupNameChange = (groupName) => {
        setGroupName(groupName);
    };
    const onToggle = (isOpen) => {
        TrackWithGuidService.trackWithGuid("dropdown", isOpen ? "open" : "close");
    };
    const config = {
        width: 320,
        maxHeight: 330,
        enabled: true,
        placement: "ontop-left",
        cssClassContent: "Popup-content--pro-dropdown",
        onToggle,
    };
    const onItemClick = (item) => () => {
        onGroupClick(item);
    };
    const onSubmit = () => {
        onSubmitProp(groupName);
    };
    const getFirstItem = () => {
        switch (mode) {
            case ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS:
                return (
                    <ItemStyled
                        disableHover={true}
                        appendSeparator={true}
                        key="item-group"
                        iconName={groupIconName}
                        iconSize="sm"
                    >
                        {currentGroup}
                    </ItemStyled>
                );
            case ETableSelectionNewGroupDropdownMode.MAX_ITEMS:
                return (
                    <ItemStyled
                        disableHover={true}
                        appendSeparator={true}
                        key="item-group"
                        iconName={groupIconName}
                        iconSize="sm"
                    >
                        {i18n(newGroupItemText)}
                    </ItemStyled>
                );
        }
    };
    const getContent = () => {
        switch (mode) {
            case ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS:
                return [
                    <TableSelectionKeywordsWarning
                        key="all-items-exist"
                        onCancel={onCancel}
                        message={i18n(allItemsExistsMessage)}
                    />,
                ];
            case ETableSelectionNewGroupDropdownMode.MAX_ITEMS:
                return [
                    <TableSelectionKeywordsWarning
                        key="max-items"
                        onCancel={onCancel}
                        message={i18n(maxItemsMessage, {
                            count: count.toString(),
                        })}
                    />,
                ];
            case ETableSelectionNewGroupDropdownMode.GROUP_LIST:
                return groups.map((item, index) => (
                    <EllipsisDropdownItem
                        key={`item-${index}`}
                        id={item.id}
                        iconName={groupIconName}
                        iconSize="sm"
                        onClick={onItemClick(item)}
                    >
                        {item.text}
                    </EllipsisDropdownItem>
                ));
        }
    };
    const getPopupContent = () => {
        const firstItem = getFirstItem();
        const content = getContent();
        return (
            <div>
                {/* div wrapper Required due to  PopupClickContainer*/}
                {firstItem}
                {mode !== ETableSelectionNewGroupDropdownMode.GROUP_LIST ? (
                    content
                ) : (
                    <ScrollArea
                        style={{ maxHeight: scrollAreaHeight, minHeight: 0 }}
                        verticalScrollbarStyle={{ borderRadius: 5 }}
                        horizontal={false}
                        smoothScrolling={true}
                        minScrollSize={48}
                    >
                        {content}
                    </ScrollArea>
                )}
            </div>
        );
    };

    return (
        <TableSelectionGroupWebsiteComponentWrap>
            <Button
                type="invertedTransparent"
                label={i18n("table.selection.create.group")}
                onClick={onNewListButtonClick}
            />
            {groups.length > 0 && (
                <PopupClickContainer
                    content={getPopupContent}
                    config={config}
                    ref={popupEl}
                    appendTo={appendTo}
                >
                    {/* div wrapper Required due to  PopupClickContainer*/}
                    <div>
                        <Button
                            type="invertedTransparent"
                            label={i18n("table.selection.add.to.list")}
                        />
                    </div>
                </PopupClickContainer>
            )}
            <ProModal
                isOpen={isCreateNewListModalOpen}
                customStyles={proModalStyles}
                onCloseClick={onCancel}
                showCloseIcon={false}
            >
                {linkToGroup ? (
                    <KeywordGeneratorToolPageModalContainerWithPadding>
                        <KeywordGeneratorToolPageModalHeader>
                            {i18n("table.selection.newgroup.websites.modal.success.title")}
                        </KeywordGeneratorToolPageModalHeader>
                        <KeywordGeneratorToolPageModalBody>
                            <svg dangerouslySetInnerHTML={{ __html: successArt }} />
                        </KeywordGeneratorToolPageModalBody>
                        <KeywordGeneratorToolPageModalFooter>
                            <a href={linkToGroup}>
                                <ButtonContainer
                                    type="primary"
                                    label={i18n(
                                        "table.selection.newgroup.websites.modal.success.visit",
                                    )}
                                />
                            </a>
                            <ButtonContainer
                                onClick={onCancel}
                                type="flat"
                                label={i18n(
                                    "table.selection.newgroup.websites.modal.success.cancel",
                                )}
                            />
                        </KeywordGeneratorToolPageModalFooter>
                    </KeywordGeneratorToolPageModalContainerWithPadding>
                ) : (
                    <ModalTableSelectionNewGroup
                        title={i18n("table.selection.newgroup.websites.modal.title")}
                        subTitle={newGroupNameLabel}
                        placeholder={i18n("table.selection.newgroup.websites.placeholder")}
                        onCancel={onCancel}
                        onSubmit={onSubmit}
                        submitButtonDisabled={groupName.length === 0 || isLoading}
                        error={error}
                        errorMessage={errorMessage}
                        onGroupNameChange={onGroupNameChange}
                        isLoading={isLoading}
                        groupType="website"
                        onListTypeSelect={onListTypeSelect}
                        selectedListType={selectedListType}
                    />
                )}
            </ProModal>
        </TableSelectionGroupWebsiteComponentWrap>
    );
};
export const TableSelectionGroupWebsiteComponent = forwardRef(
    TableSelectionGroupWebsiteComponentRenderFunction,
);
