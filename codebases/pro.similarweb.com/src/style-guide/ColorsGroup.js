export class ColorsGroup {
    constructor(name, obj) {
        Object.defineProperty(this, 'toArray', {
            value: () => Object.values(obj)
        });
        Object.defineProperty(this, 'name', {
            value: name
        });
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
}