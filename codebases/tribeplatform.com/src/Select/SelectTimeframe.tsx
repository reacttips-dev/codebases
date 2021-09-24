import React from 'react';
import { Flex } from '@chakra-ui/layout';
import { HStack } from '@chakra-ui/react';
import { useMultiStyleConfig } from '@chakra-ui/system';
import { useRouter } from 'next/router';
import ArrowDownSLineIcon from 'remixicon-react/ArrowDownSLineIcon';
import CalendarEventLineIcon from 'remixicon-react/CalendarEventLineIcon';
import { Dropdown, DropdownBox, DropdownItem, DropdownList } from '../Dropdown';
import { Icon } from '../Icon';
import { PlanBadge } from '../PlanBadge';
import { Text } from '../Text';
export const SelectTimeframe = ({ value, options, onChange, open, size, }) => {
    const styles = useMultiStyleConfig('Select', { size });
    const router = useRouter();
    return (React.createElement(Dropdown, { defaultIsOpen: open },
        React.createElement(DropdownBox, null,
            React.createElement(HStack, { "data-testid": "analytics-time-frame-dd", border: "1px solid", borderColor: "border.base", bgColor: "bg.base", px: "4", py: "2", borderRadius: "md", cursor: "pointer" },
                React.createElement(Icon, { as: CalendarEventLineIcon, h: "4", w: "4", cursor: "pointer" }),
                React.createElement(Text, { textStyle: "medium/medium", fontSize: "sm" }, "Timeframe:"),
                React.createElement(Text, { textStyle: "medium/medium", fontSize: "sm", color: "accent.base", style: {
                        marginLeft: '4px',
                    } }, value === null || value === void 0 ? void 0 : value.label),
                React.createElement(Icon, { as: ArrowDownSLineIcon }))),
        React.createElement(DropdownList, null, options.map(item => {
            var _a;
            return (React.createElement(DropdownItem, { d: "flex", key: item.value, onClick: () => {
                    if (item.permission.requiredPlan && !item.permission.authorized) {
                        router.push('/admin/network/billing');
                    }
                    else {
                        onChange(item);
                    }
                }, sx: styles.item, isActive: (value === null || value === void 0 ? void 0 : value.value) === item.value, w: "full", justifyContent: "flex-start", style: { padding: '4px', boxShadow: 'none' } },
                React.createElement(Flex, { justifyContent: "space-between", flex: "1" },
                    React.createElement(Text, { textStyle: "medium/regular", fontSize: "sm" }, item.label),
                    ((_a = item.permission) === null || _a === void 0 ? void 0 : _a.requiredPlan) && (React.createElement(PlanBadge, { plan: item.permission.requiredPlan, isAuthorized: item.permission.authorized })))));
        }))));
};
//# sourceMappingURL=SelectTimeframe.js.map