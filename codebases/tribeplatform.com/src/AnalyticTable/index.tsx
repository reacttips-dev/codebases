import React, { memo } from 'react';
import { Box, Text, GridItem, Flex } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';
import InformationFillIcon from 'remixicon-react/InformationFillIcon';
import { Divider } from '../Divider';
import { useResponsive } from '../hooks/useResponsive';
import { Icon } from '../Icon';
import { Table } from '../Table';
import { textStyles } from '../theme/foundations/typography';
import { Tooltip } from '../Tooltip';
export const AnalyticTable = ({ colSpan, title, subtitle, moreInfo, data, columns, showHeaders, }) => {
    const { isMobile } = useResponsive();
    if (!Array.isArray(data))
        return null;
    return (React.createElement(GridItem, { colSpan: isMobile ? 6 : colSpan, bg: "bg.base", borderRadius: "md", border: "1px solid", borderColor: "border.base" },
        React.createElement(Box, { px: "3", pt: "4", pb: "3" },
            React.createElement(Text, { textStyle: "regular/large", color: "label.primary" }, title),
            React.createElement(Flex, { align: "center" },
                subtitle && (React.createElement(Text, { textStyle: "regular/small", color: "label.secondary" }, subtitle)),
                moreInfo && (React.createElement(Tooltip, { label: moreInfo, closeOnClick: false },
                    React.createElement(Flex, { cursor: "pointer" },
                        React.createElement(Icon, { d: "flex", ml: "2px", as: InformationFillIcon, h: "3", w: "3", color: "label.secondary" })))))),
        React.createElement(Divider, { color: "stroke", width: "full" }),
        React.createElement(Table, { headerProps: {
                padding: null,
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 5,
                paddingBottom: 1,
                color: 'label.primary',
                ...textStyles['semibold/small'],
            }, data: data, hasMore: true, total: 5, showColumnsFilter: false, columns: columns, showHeaders: showHeaders })));
};
export default memo(AnalyticTable, isEqual);
//# sourceMappingURL=index.js.map