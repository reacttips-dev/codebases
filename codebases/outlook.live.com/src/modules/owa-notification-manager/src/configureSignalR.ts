export default function configureSignalR(): void {
    // Set a default timeout for SignalR requests
    $.signalR.ajaxDefaults.timeout = 60000;

    // Make the SSE reconnect timeout longer so a request has a longer time to connect before SignalR retries it
    ($.signalR.transports.serverSentEvents as any).timeOut = 60000;
}
