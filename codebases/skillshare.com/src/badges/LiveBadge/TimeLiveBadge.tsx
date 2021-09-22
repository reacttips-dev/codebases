var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { format, utcToZonedTime } from 'date-fns-tz';
import PropTypes from 'prop-types';
import { Chip, makeStyles } from '@material-ui/core';
import { useTimeKind } from '../../shared/hooks';
import { TimeKind } from '../../shared/time-kind';
import { InnerLiveBadge } from './InnerLiveBadge';
var getFormattedLabel = function (startDate, kind, timeZone) {
    if (timeZone === void 0) { timeZone = 'America/New_York'; }
    var ztStartDate = utcToZonedTime(startDate, timeZone);
    switch (kind) {
        case TimeKind.NOW:
            return 'Now';
        case TimeKind.TODAY:
            return "Today, " + format(ztStartDate, "h:mmaaaaa'm.' zzz", { timeZone: timeZone });
        case TimeKind.FUTURE:
            return format(ztStartDate, "MMMM dd, h:mmaaaaa'm.' zzz", { timeZone: timeZone });
        case TimeKind.PAST:
            return "Took place on " + format(ztStartDate, "MMMM dd, h:mmaaaaa'm.' zzz", { timeZone: timeZone });
    }
};
var useTimeBadgeStyles = makeStyles(function (_a) {
    var typography = _a.typography, palette = _a.palette, spacing = _a.spacing;
    var fontSize = typography.fontSize, pxToRem = typography.pxToRem;
    return {
        root: function (_a) {
            var kind = _a.kind;
            var backgroundColor;
            var borderColor;
            var color = palette.text.primary;
            switch (kind) {
                case TimeKind.NOW:
                    borderColor = palette.hardAccent.main;
                    backgroundColor = palette.hardAccent.main;
                    break;
                case TimeKind.TODAY:
                    borderColor = palette.primary.main;
                    backgroundColor = palette.primary.main;
                    break;
                default:
                    borderColor = palette.primary.main;
                    backgroundColor = palette.secondary.main;
                    color = palette.getContrastText(backgroundColor);
                    break;
            }
            return {
                color: color,
                borderColor: borderColor,
                height: 'auto',
                borderWidth: 2,
                backgroundColor: backgroundColor,
                borderStyle: 'solid',
            };
        },
        icon: {
            marginLeft: 10,
        },
        label: function (_a) {
            var kind = _a.kind;
            var spacingValue = kind === (TimeKind.PAST || TimeKind.FUTURE) ? 0 : 1;
            return {
                fontWeight: 400,
                paddingLeft: spacing(spacingValue),
                paddingRight: 14,
                fontSize: fontSize * 1.3,
                lineHeight: pxToRem(fontSize * 1.4),
            };
        },
    };
});
export function TimeLiveBadge(props) {
    var startDate = props.startDate, endDate = props.endDate;
    var kind = useTimeKind(startDate, endDate);
    var classes = useTimeBadgeStyles({ kind: kind });
    var isNow = kind === TimeKind.NOW;
    var innerBadgeProps = {
        color: isNow ? 'hardAccent' : 'default',
        animated: isNow,
        kind: kind,
    };
    var InnerBadge = React.createElement(InnerLiveBadge, __assign({}, innerBadgeProps));
    return (React.createElement(Chip, { classes: classes, icon: InnerBadge, className: "live-badge time", label: React.createElement("span", { className: "label" }, getFormattedLabel(startDate, kind)) }));
}
TimeLiveBadge.propTypes = {
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
};
//# sourceMappingURL=TimeLiveBadge.js.map