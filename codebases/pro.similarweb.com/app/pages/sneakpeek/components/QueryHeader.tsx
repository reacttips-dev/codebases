import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import React, { Component } from "react";
import { FlexRow } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { Feedback } from "../SneakpeekFeedback";
import {
    QueryHeaderContainer,
    QuerySqlWrapper,
    QueryTitle,
    QueryTitleActions,
} from "../StyledComponents";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";

export class QueryHeader extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            showSql: false,
        };
    }

    public toggleSql = () => {
        this.setState({ showSql: !this.state.showSql });
    };

    public render() {
        const { showSql } = this.state;
        const {
            title,
            feedback,
            queryId,
            ownList,
            sql,
            onRemove,
            onEdit,
            onDelete,
            hasPNG,
            getPNG,
            excelLink,
            isExcelEnabled,
        } = this.props;
        let excelLinkHref;
        if (excelLink) {
            excelLinkHref = isExcelEnabled ? { href: excelLink } : {};
        }
        const hasFeedback = !!(feedback && feedback.questions && feedback.questions.length);
        return (
            <>
                <QueryHeaderContainer>
                    <QueryTitle>{title}</QueryTitle>
                    <QueryTitleActions>
                        {hasFeedback && (
                            <Feedback feedback={feedback} queryTitle={title} queryId={queryId} />
                        )}
                        {!!excelLink && (
                            <PlainTooltip
                                tooltipContent={
                                    isExcelEnabled
                                        ? ""
                                        : "execute the query to enable exporting to excel"
                                }
                                cssClass="PlainTooltip-element PlainTooltip--downloadButton"
                                enabled={!isExcelEnabled}
                            >
                                <a {...excelLinkHref}>
                                    <IconButton
                                        type="flat"
                                        iconName="excel"
                                        isDisabled={!isExcelEnabled}
                                    />
                                </a>
                            </PlainTooltip>
                        )}
                        {hasPNG && <DownloadButtonMenu PNG={true} exportFunction={getPNG} />}
                        <FlexRow>
                            {ownList && (
                                <>
                                    <PlainTooltip
                                        tooltipContent={showSql ? "Hide query" : "Show query"}
                                    >
                                        <div>
                                            <IconButton
                                                iconName={showSql ? "chev-up" : "chev-down"}
                                                type="flat"
                                                onClick={this.toggleSql}
                                            />
                                        </div>
                                    </PlainTooltip>
                                    <PlainTooltip tooltipContent="Edit query">
                                        <div>
                                            <IconButton
                                                iconName="edit-icon"
                                                type="flat"
                                                onClick={onEdit}
                                            />
                                        </div>
                                    </PlainTooltip>
                                    <PlainTooltip tooltipContent="Delete query">
                                        <div>
                                            <IconButton
                                                iconName="delete"
                                                type="flat"
                                                onClick={onDelete}
                                            />
                                        </div>
                                    </PlainTooltip>
                                </>
                            )}
                            <PlainTooltip tooltipContent="Remove from page">
                                <div>
                                    <IconButton iconName="clear" type="flat" onClick={onRemove} />
                                </div>
                            </PlainTooltip>
                        </FlexRow>
                    </QueryTitleActions>
                </QueryHeaderContainer>
                {ownList && showSql && <QuerySqlWrapper>{sql}</QuerySqlWrapper>}
            </>
        );
    }
}
