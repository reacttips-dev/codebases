export default class NaiveColorStack {
    constructor(private color: string) {}

    reset() {}

    acquire() {
        return this.color;
    }
    release(color) {}
}
