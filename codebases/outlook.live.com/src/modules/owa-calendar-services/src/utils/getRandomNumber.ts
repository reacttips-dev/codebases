export function getRandomNumber(): string {
    const min = 1;
    const max = 0xffff;
    return Math.ceil(Math.random() * (max - min) + min).toString(16);
}
