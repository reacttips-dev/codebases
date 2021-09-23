import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import CheckLineIcon from 'remixicon-react/CheckLineIcon';
import LockFillIcon from 'remixicon-react/LockFillIcon';
import { PlanName } from 'tribe-api';
import { Trans } from 'tribe-translation';
import { Text } from '../Text';
export const PlanBadge = ({ plan, isAuthorized, ...rest }) => (React.createElement(Flex, Object.assign({ bgColor: "bg.secondary", py: 1, px: 2, borderRadius: "30px" }, rest),
    isAuthorized ? (React.createElement(Box, { color: "success.base" },
        React.createElement(CheckLineIcon, { "data-testid": "plan-badge-check-icon", size: 14 }))) : (React.createElement(Box, { color: "label.secondary" },
        React.createElement(LockFillIcon, { "data-testid": "plan-badge-lock-icon", size: 14 }))),
    React.createElement(Text, { ml: 1, textStyle: "regular/xsmall" },
        plan === PlanName.PREMIUM && (React.createElement(Trans, { i18nKey: "planName.premium", defaults: "Premium Plan" })),
        plan === PlanName.PLUS && (React.createElement(Trans, { i18nKey: "planName.plus", defaults: "Plus Plan" })),
        plan === PlanName.BASIC && (React.createElement(Trans, { i18nKey: "planName.basic", defaults: "Basic Plan" })),
        plan === PlanName.ENTERPRISE && (React.createElement(Trans, { i18nKey: "planName.enterprise", defaults: "Enterprise Plan" })))));
export default PlanBadge;
//# sourceMappingURL=PlanBadge.js.map