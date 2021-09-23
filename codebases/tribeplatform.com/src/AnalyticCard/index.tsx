import React, { memo } from 'react';
import { HStack, Text, GridItem, Flex, Square } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';
import ArrowDownLineIcon from 'remixicon-react/ArrowDownLineIcon';
import ArrowUpLineIcon from 'remixicon-react/ArrowUpLineIcon';
import InformationFillIcon from 'remixicon-react/InformationFillIcon';
import { formatCount } from 'tribe-translation';
import Card from '../Card';
import { useResponsive } from '../hooks/useResponsive';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
export const AnalyticCard = ({ colSpan, title, subtitle, moreInfo, value, previousValue, children, lines = [], hideValue = false, hidePreviousValue = false, }) => {
    const { isMobile } = useResponsive();
    const currValue = parseInt(value, 10) || 0;
    const prevValue = parseInt(previousValue, 10) || 0;
    const changeIsPositive = currValue >= prevValue;
    const changeColor = changeIsPositive ? 'success.base' : 'danger.base';
    return (React.createElement(GridItem, { colSpan: isMobile ? 6 : colSpan },
        React.createElement(Card, null,
            React.createElement(Text, { textStyle: "regular/large", color: "label.primary" }, title),
            React.createElement(Flex, { mt: "1", align: "center" },
                React.createElement(Text, { textStyle: "regular/small", color: "label.secondary" }, subtitle),
                moreInfo && (React.createElement(Tooltip, { label: moreInfo, closeOnClick: false },
                    React.createElement(Flex, { cursor: "pointer" },
                        React.createElement(Icon, { d: "flex", ml: "2px", as: InformationFillIcon, h: "3", w: "3", color: "label.secondary" }))))),
            React.createElement(HStack, { justifyContent: "space-between" },
                hideValue ? (React.createElement("div", null, "\u00A0")) : (React.createElement(Flex, { mt: "1", align: "center" },
                    React.createElement(Tooltip, { isDisabled: currValue === Number(formatCount(currValue)), label: currValue, closeOnClick: false },
                        React.createElement(Text, { textStyle: "regular/2xlarge", color: "label.primary" }, formatCount(currValue))),
                    !hidePreviousValue && (React.createElement(React.Fragment, null,
                        React.createElement(Icon, { ml: "2px", as: changeIsPositive ? ArrowUpLineIcon : ArrowDownLineIcon, h: "3", w: "3", color: changeColor }),
                        React.createElement(Text, { ml: "1px", textStyle: "regular/medium", color: changeColor }, prevValue))))),
                lines.length > 0 && (React.createElement(Flex, { align: "center" }, lines.map((legend) => (React.createElement(Flex, { mr: "4", align: "center", key: legend.name },
                    React.createElement(Square, { size: "12px", bg: legend.color, borderRadius: "sm" }),
                    React.createElement(Text, { ml: "2", color: "label.secondary" }, legend.name))))))),
            children)));
};
export default memo(AnalyticCard, isEqual);
//# sourceMappingURL=index.js.map