export class ValidationMessagesError extends Error {
    constructor(validationMessages) {
        super(validationMessages);
        this.name = ValidationMessagesError.NAME;
        this.validationMessages = validationMessages || [];
        Object.setPrototypeOf(this, ValidationMessagesError.prototype);
    }
}
ValidationMessagesError.NAME = "ValidationMessagesError";
//# sourceMappingURL=ValidationMessagesError.js.map