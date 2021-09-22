export default function urlBase64ToUint8Array(base64String: string, windowObj: Window): Uint8Array {
    const repeatation = (4 - (base64String.length % 4)) % 4;
    let padding = '';
    for (let i = 0; i < repeatation; i++) {
        padding += '=';
    }

    let base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    let rawData = windowObj.atob(base64);
    let outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
