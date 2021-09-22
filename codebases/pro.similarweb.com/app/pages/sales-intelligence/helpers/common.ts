/**
 * It is just a typed Object.create function
 * @param prototype
 */
export const objectCreate = <T extends {}>(prototype: T) => {
    return Object.create(prototype) as T;
};
/**
 * Generates unique id string
 */
export const getUniqueId = () => {
    return window.crypto.getRandomValues(new Uint32Array(1)).toString();
};
