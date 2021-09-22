export default function sleep(t: number): Promise<undefined> {
    return new Promise(resolve => setTimeout(resolve, t));
}
