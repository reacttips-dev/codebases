export default function getTimeString(): string {
    return new Date(Date.now()).toLocaleTimeString();
}
