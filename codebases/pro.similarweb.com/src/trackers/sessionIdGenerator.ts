export default function getSessionId() {
    const crypto = window.crypto || (window as any).msCrypto;
    if (crypto) {
        return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => {
                // tslint:disable-next-line:no-bitwise
                return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
        });
    } else {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            // tslint:disable-next-line:no-bitwise
            const r = Math.random() * 16 | 0;
            // tslint:disable-next-line:no-bitwise
            const v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
    }
}



// WEBPACK FOOTER //
// ./src/trackers/sessionIdGenerator.ts