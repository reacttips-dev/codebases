import { colorsPalettes } from "@similarweb/styles";
import { rgba } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { Dropdown, DropdownItem, NoBorderButton } from "@similarweb/ui-components/dist/dropdown";
import React from "react";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { ProModal } from "../../../../.pro-features/components/Modals/src/ProModal";
import { i18nFilter } from "../../../filters/ngFilters";
import BaseWorkspaceApiService from "../../../services/workspaces/baseWorkspaceApiService";
import { IOpportunityListItemTrackStatus } from "./types";

const api = new BaseWorkspaceApiService();

export interface IWatchListModalProps {
    domain: string;

    onClose();

    onSelect(item: IOpportunityListItemTrackStatus);
}

interface IWatchListModalState {
    isOpen: boolean;
    items: IOpportunityListItemTrackStatus[];
    listToAdd: IOpportunityListItemTrackStatus;
}

const PlaceHolder = styled(NoBorderButton)`
    display: flex;
    > div:first-of-type {
        max-width: 360px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const AddDomainText = styled.span`
    margin-right: 6px;
    color: ${`${rgba(colorsPalettes.carbon["500"], 0.6)}`};
`;

const ButtonsContainer = styled.div`
    margin-top: 38px;
    display: flex;
    flex-direction: row-reverse;
`;

const Add = styled(Button)`
    margin-left: 24px;
`;

const ListDropDownItemWrapper = styled(DropdownItem)`
    padding: 0 16px;
`;

const ListDropDownItemContent = styled.div`
    max-width: 360px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ListDropDownItem = (props) => {
    const { children, ...rest } = props;
    return (
        <ListDropDownItemWrapper {...rest}>
            <ListDropDownItemContent>{children}</ListDropDownItemContent>
        </ListDropDownItemWrapper>
    );
};

export class WatchListModal extends React.Component<IWatchListModalProps, IWatchListModalState> {
    state: IWatchListModalState = {
        items: [],
        isOpen: true,
        listToAdd: null,
    };

    closeModal = () => {
        this.setState({
            isOpen: false,
        });
    };

    onSelect = (listToAdd) => {
        this.setState({
            listToAdd,
        });
    };

    onSave = () => {
        this.closeModal();
        this.props.onSelect(this.state.listToAdd);
    };

    onCancel = () => {
        TrackWithGuidService.trackWithGuid("website_analysis.watchlist_modal.cancel", "click");
        this.closeModal();
    };

    async componentDidMount() {
        const items = await api.getTrackingStatus(this.props.domain);
        this.setState({
            items,
            listToAdd: items.find((list) => !list.isTracked),
        });
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        if (!this.state.isOpen) {
            this.props.onClose();
        }
    }

    render() {
        const { items, listToAdd } = this.state;
        const selectedItemsIds = items.reduce((selectedIds, { isTracked, opportunityListId }) => {
            return isTracked
                ? {
                      ...selectedIds,
                      [opportunityListId]: true,
                  }
                : selectedIds;
        }, {});
        return (
            <ProModal
                customStyles={{
                    content: {
                        width: "420px",
                        height: "144px",
                        padding: "24px",
                        marginTop: "83px",
                    },
                }}
                showCloseIcon={false}
                onCloseClick={this.closeModal}
                isOpen={this.state.isOpen}
                shouldCloseOnOverlayClick={false}
            >
                <Dropdown
                    buttonWidth={"auto"}
                    selectedIds={selectedItemsIds}
                    hasSearch={false}
                    disabled={!listToAdd}
                    onClick={this.onSelect}
                    itemsComponent={ListDropDownItem}
                    dropdownPopupPlacement="ontop-left"
                    width={360}
                >
                    {[
                        <PlaceHolder key={"button"}>
                            <AddDomainText>
                                {i18nFilter()(`workspaces.watchmodal.addtolist`, {
                                    domain: this.props.domain,
                                })}
                            </AddDomainText>
                            {listToAdd && listToAdd.opportunityListName}
                        </PlaceHolder>,
                        ...items.map((item) => ({
                            ...item,
                            id: item.opportunityListId,
                            text: item.opportunityListName,
                            disabled: item.isTracked,
                        })),
                    ]}
                </Dropdown>
                <ButtonsContainer>
                    <Add
                        type="primary"
                        isDisabled={!listToAdd}
                        onClick={this.onSave}
                        dataAutomation="watch-list-modal-add-button"
                    >
                        {i18nFilter()("workspaces.watchmodal.add")}
                    </Add>
                    <Button
                        type="flat"
                        onClick={this.onCancel}
                        dataAutomation="watch-list-modal-cancel-button"
                    >
                        {i18nFilter()("workspaces.watchmodal.cancel")}
                    </Button>
                </ButtonsContainer>
            </ProModal>
        );
    }
}
