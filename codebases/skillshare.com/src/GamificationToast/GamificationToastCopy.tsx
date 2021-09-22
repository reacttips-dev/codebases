var _a;
export var GAMIFICATION_ACTION_STEPS;
(function (GAMIFICATION_ACTION_STEPS) {
    GAMIFICATION_ACTION_STEPS["JOIN_SKILLSHARE"] = "JOIN_SKILLSHARE";
    GAMIFICATION_ACTION_STEPS["WATCH_THREE_LESSONS"] = "WATCH_THREE_LESSONS";
    GAMIFICATION_ACTION_STEPS["UPLOAD_PROJECT"] = "UPLOAD_PROJECT";
    GAMIFICATION_ACTION_STEPS["FINISH_A_CLASS"] = "FINISH_A_CLASS";
    GAMIFICATION_ACTION_STEPS["JOIN_WORKSHOP"] = "JOIN_WORKSHOP";
})(GAMIFICATION_ACTION_STEPS || (GAMIFICATION_ACTION_STEPS = {}));
var GAMIFICATION_TOAST_COPY = (_a = {},
    _a[GAMIFICATION_ACTION_STEPS.WATCH_THREE_LESSONS] = {
        title: 'Great job!',
        subtext: "You've completed 3 Lessons.",
    },
    _a[GAMIFICATION_ACTION_STEPS.UPLOAD_PROJECT] = {
        title: "That's progress!",
        subtext: 'Way to get hands-on and set your creativity free.',
    },
    _a[GAMIFICATION_ACTION_STEPS.FINISH_A_CLASS] = {
        title: 'Nice work!',
        subtext: "You've watched a complete class.",
    },
    _a[GAMIFICATION_ACTION_STEPS.JOIN_WORKSHOP] = {
        title: "It's on!",
        subtext: 'You joined your first workshop.',
    },
    _a);
export var useGamificationToastCopy = function (actionStep) {
    return GAMIFICATION_TOAST_COPY[actionStep];
};
//# sourceMappingURL=GamificationToastCopy.js.map