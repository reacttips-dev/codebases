import React from 'react';
import { StarIcon } from '../Icons';
import { Badge } from './Badge';
export var TeacherBadge = function (_a) {
    var isTopTeacher = _a.isTopTeacher;
    if (isTopTeacher) {
        return React.createElement(Badge, { icon: React.createElement(StarIcon, null), label: "Top Teacher" });
    }
    return React.createElement(Badge, { label: "Teacher" });
};
//# sourceMappingURL=TeacherBadge.js.map