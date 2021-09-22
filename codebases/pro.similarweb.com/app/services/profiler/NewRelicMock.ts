export class NewRelicMock {
    public mockStorage = [];

    constructor(private _name = "New Relic Mock", private _attributes = {}) {}

    save() {}

    end() {
        const interactionObj = {};
        interactionObj[this._name] = this._attributes;
        this.mockStorage.push(interactionObj);
    }

    setName(name) {
        this._name = name;
    }

    setAttribute(name, value) {
        this._attributes[name] = value;
    }

    getAttributes() {
        return this._attributes;
    }
}
