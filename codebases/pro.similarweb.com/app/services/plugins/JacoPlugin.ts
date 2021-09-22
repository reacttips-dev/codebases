import swLog from "@similarweb/sw-log";

export function isJacoRunning() {
    return !!window["JacoRecorder"];
}

export function isJacoRecording() {
    const isRecording =
        isJacoRunning() && window["JacoRecorder"].state && window["JacoRecorder"].state.isRecording;
    swLog.debug("Jaco Recording Status: " + isRecording);
    return isRecording;
}

export function startJacoRecorder() {
    if (isJacoRunning() && !isJacoRecording()) {
        swLog.debug("Starting Jaco");
        return window["JacoRecorder"].startRecording();
    }
}

export function stopJacoRecorder() {
    if (isJacoRunning() && isJacoRecording()) {
        swLog.debug("Stopping Jaco");
        return window["JacoRecorder"].stopRecording();
    }
}

export function setRecordingStatus(record) {
    return record ? startJacoRecorder() : stopJacoRecorder();
}
