export const gridsterPreferences = {
    columns: 4, // the width of the grid, in columns
    pushing: true, // whether to push other items out of the way on move or resize
    floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
    swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
    width: "auto", // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
    colWidth: "auto", // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
    rowHeight: 359, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
    margins: [25, 25], // the pixel distance between each widget
    outerMargin: false, // whether margins apply to outer edges of the grid
    isMobile: false, // stacks the grid items if true
    mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
    mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
    minColumns: 4, // the minimum columns the grid must have
    minRows: 1, // the minimum height of the grid, in rows
    maxRows: 100,
    defaultSizeX: 3, // the default width of a gridster item, if not specified
    defaultSizeY: 1, // the default height of a gridster item, if not specified
    minSizeX: 1, // minimum column width of an item
    maxSizeX: 4, // maximum column width of an item
    minSizeY: 1, // minimum row height of an item
    maxSizeY: 2,
    resizable: {
        enabled: true,
    },
    draggable: {
        enabled: true,
        scrollSensitivity: 200, // Distance in pixels from the edge of the viewport after which the viewport should scroll, relative to pointer
        scrollSpeed: 30, // Speed at which the window should scroll once the mouse pointer gets within scrollSensitivity distance
        dragContainer: ".layout-stage", // class of the drag container
    },
};
