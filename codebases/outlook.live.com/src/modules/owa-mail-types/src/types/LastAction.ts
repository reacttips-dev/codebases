// These are the possible user actions for an item
enum LastAction {
    // Opened an item
    Open = 0,

    // Voting option lower limit
    VotingOptionMin = 1,

    // Voting option upper limit
    VotingOptionMax = 31,

    // P.M. action
    First = 100,

    // Reply to sender
    ReplyToSender = 102,

    // Reply to all
    ReplyToAll = 103,

    // Forward action
    Forward = 104,

    // Reply to Folder
    ReplyToFolder = 108,
}

export default LastAction;
