declare const window: any;

export const getUuid = () => {
    const crypto = window.crypto || window.msCrypto;
    window.guidModern =
        window.guidModern ||
        (() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => {
                return (
                    c ^
                    (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
                ).toString(16);
            });
        });

    return window.guidModern();
};
