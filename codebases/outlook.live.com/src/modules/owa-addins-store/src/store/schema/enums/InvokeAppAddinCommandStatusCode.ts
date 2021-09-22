enum InvokeAppAddinCommandStatusCode {
    TimedOut = -1,
    Success = 0,
    FunctionNotFound = 11101,
    NavigatedBeforeCompleted = 13001,
    PreinstalledConsented = 13002,
    Unknown = 13003,
}

export default InvokeAppAddinCommandStatusCode;
