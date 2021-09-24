import React, { memo } from 'react';
import { Text, Box, Flex, Square } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip as ChartsTooltip, Line, ResponsiveContainer, } from 'recharts';
import { formatCount } from 'tribe-translation';
import { AnalyticCard } from '../AnalyticCard';
const AnalyticsTooltip = ({ payload, label, active }) => {
    if (active && payload && payload.length) {
        return (React.createElement(Box, { bg: "bg.base", p: "2", boxShadow: "md", borderRadius: "md" },
            React.createElement(Text, { textStyle: "medium/small" }, label),
            React.createElement(Box, { mt: "1" }, payload.map(entry => {
                const { name, color, value } = entry;
                return (React.createElement(Flex, { align: "center", key: name },
                    React.createElement(Square, { size: "12px", borderRadius: "sm", bg: color, color: "white" }),
                    React.createElement(Text, { marginLeft: 2, color: "label.secondary" },
                        name,
                        ":"),
                    React.createElement(Text, { marginLeft: 1, color: color }, formatCount(value))));
            }))));
    }
    return null;
};
export const Chart = ({ data = [], title, subtitle, moreInfo, value, previousValue, lines, hideValue, hidePreviousValue, }) => {
    return (React.createElement(AnalyticCard, { colSpan: 6, title: title, subtitle: subtitle, moreInfo: moreInfo, value: value, previousValue: previousValue, lines: lines, hideValue: hideValue, hidePreviousValue: hidePreviousValue },
        React.createElement(Box, { mt: "4", w: "full" },
            React.createElement(ResponsiveContainer, { width: "100%", height: 250 },
                React.createElement(LineChart, { data: data, margin: { top: 5, right: 30, left: 10, bottom: 5 } },
                    React.createElement(CartesianGrid, { strokeDasharray: "0", vertical: false, stroke: "#EAF0F4" }),
                    React.createElement(XAxis, { tick: { fontSize: 12 }, tickMargin: 12, dataKey: "name", axisLine: false, tickLine: false }),
                    React.createElement(YAxis, { tick: { fontSize: 12 }, tickMargin: 6, axisLine: false, tickLine: false, width: 32, type: "number", tickFormatter: value => formatCount(value) }),
                    React.createElement(ChartsTooltip, { content: AnalyticsTooltip, cursor: {
                            stroke: '#C6C6D2',
                            strokeDasharray: '5 5',
                        } }),
                    lines.map(({ name, dataKey, color }) => (React.createElement(Line, { isAnimationActive: false, key: name, type: "monotone", dataKey: dataKey, dot: false, activeDot: false, strokeWidth: 2, stroke: color, name: name }))))))));
};
export default memo(Chart, isEqual);
//# sourceMappingURL=index.js.map