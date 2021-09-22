import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import styled from "styled-components";

const WidgetCustomAssetTooltipContent = styled.div`
    padding: 0px;
`;

const WidgetCustomAssetTooltipTitle = styled.h1`
    font-weight: 400;
    line-height: 28px;
    margin: 0px;
    font-size: 14px;
    color: ${colorsPalettes.carbon["300"]};
    letter-spacing: 0.7px;
`;

const WidgetCustomAssetTooltipListContainer = styled.ul`
    list-style: none;
    margin: 0px 0px 0px 5px;
`;

const WidgetCustomAssetTooltipListItem = styled.li`
    font-weight: 300;
    line-height: 28px;
    font-size: 13px;
    color: ${colorsPalettes.carbon["300"]};
    letter-spacing: 0.7px;
`;

const WidgetCustomAssetTooltipBottomText = styled.h2`
    font-weight: 400;
    line-height: 28px;
    margin: 0px 0px 0px 5px;
    font-size: 14px;
    color: ${colorsPalettes.carbon["300"]};
    letter-spacing: 0.7px;
`;

const WidgetCustomAssetTooltip: React.StatelessComponent<any> = ({
    name,
    iconClasName,
    title,
    listItems,
    type,
    visibleItems,
}) => {
    let listItemsElements = [];
    listItems &&
        listItems.slice(0, visibleItems - 1).forEach((item) => {
            listItemsElements.push(
                <WidgetCustomAssetTooltipListItem key={item}>
                    {item}
                </WidgetCustomAssetTooltipListItem>,
            );
        });
    return (
        <div style={{ display: "inline-block" }}>
            <PopupHoverContainer
                content={() => (
                    <WidgetCustomAssetTooltipContent>
                        <WidgetCustomAssetTooltipTitle>{title}</WidgetCustomAssetTooltipTitle>
                        <WidgetCustomAssetTooltipListContainer>
                            {listItemsElements}
                        </WidgetCustomAssetTooltipListContainer>
                        {listItems && listItems.length > visibleItems ? (
                            <WidgetCustomAssetTooltipBottomText>
                                +{listItems.length - visibleItems} {type}
                            </WidgetCustomAssetTooltipBottomText>
                        ) : null}
                    </WidgetCustomAssetTooltipContent>
                )}
                config={{
                    enabled: true,
                    placement: "bottom",
                    allowHover: true,
                    closeDelay: 500,
                    cssClass: "Popup-element-wrapper--lite",
                    cssClassContent: "Popup-content--lite",
                }}
            >
                <div style={{ display: "inline-block" }}>
                    <span
                        className={`item-img ${iconClasName}`}
                        style={{ margin: "5px 5px 0 0" }}
                    />
                    <span className={`item-name`} title={name}>
                        {name}
                    </span>
                </div>
            </PopupHoverContainer>
        </div>
    );
};
SWReactRootComponent(WidgetCustomAssetTooltip, "WidgetCustomAssetTooltip");

export default WidgetCustomAssetTooltip;
