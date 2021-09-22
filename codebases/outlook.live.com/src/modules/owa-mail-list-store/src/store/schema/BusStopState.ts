enum BusStopState {
    // No icon to show - this state is for item parts before the start or after the end of the bus line.
    None = 0,

    // Start of the bus line. This is currently a line extending down from a checkmark. Represented visually by:
    BusStart = 1,

    // End of the bus line. Represented visually by:
    BusEnd = 2,

    // This is a bus stop between the start and end of the bus line. Represented visually by:
    BusStop = 3,

    // This is not a bus stop, but the node is between the start and end of the bus. Represented visually by:
    NoStop = 4,

    // This is the case where the selected item has no parent node. We just want to show a single check mark
    // with no bus lines.
    CheckMark = 5,
}

export default BusStopState;
