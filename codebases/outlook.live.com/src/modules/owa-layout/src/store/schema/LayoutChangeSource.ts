// ONLY ADD SOURCES TO THE BOTTOM AS WE ARE USING THIS FOR LOGGING!
enum LayoutChangeSource {
    Auto = 0,
    Init = 1,
    LeftNavResizeExpand = 2,
    ToggleExpand = 3,
    ToggleCollapse = 4,
    WindowResize = 5,
    ToggleFolderPane = 6,
    DateRangeTypeChange = 7,
    CalendarViewTypeChange = 8,
    OwaSuiteHeaderFlexPane = 9,
}

export default LayoutChangeSource;
