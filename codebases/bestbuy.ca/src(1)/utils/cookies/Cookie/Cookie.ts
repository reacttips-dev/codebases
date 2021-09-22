// tslint:disable:variable-name
export class Cookie {
    constructor(name, value) {
        this.DEFAULT_PATH = "/";
        this.EMPTY_STRING = "";
        this._path = this.DEFAULT_PATH;
        this._name = name;
        this._value = value;
    }
    get name() {
        return this._name;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    get path() {
        return this._path;
    }
    set path(path) {
        this._path = path.length <= 0 ? this.DEFAULT_PATH : path;
    }
    get secure() {
        return this._secure;
    }
    set secure(isSecure) {
        this._secure = isSecure;
    }
    get httpOnly() {
        return this._httpOnly;
    }
    set httpOnly(isHttpOnly) {
        this._httpOnly = isHttpOnly;
    }
    get domain() {
        return this._domain;
    }
    set domain(domain) {
        // TODO: validate if bestbuy domain
        this._domain = domain !== undefined ? domain : this.EMPTY_STRING;
    }
    get expires() {
        return this._expires;
    }
    set expires(expiry) {
        this._expires = expiry;
    }
    get maxAge() {
        return this._maxAge;
    }
    set maxAge(maxAge) {
        this._maxAge = maxAge;
    }
    serialize() {
        const serializedExpires = this.expires ? `expires=${this.expires.toUTCString()};` : this.EMPTY_STRING;
        const serializedDomain = this.domain ? `domain=${this.domain};` : this.EMPTY_STRING;
        const serializedMaxAge = this.maxAge ? `max-age=${this.maxAge};` : this.EMPTY_STRING;
        const serializedPath = this.path ? `path=${this.path};` : this.EMPTY_STRING;
        const serializedSecure = this.secure ? `secure;` : this.EMPTY_STRING;
        const serializedHttpOnly = this.httpOnly ? `httpOnly;` : this.EMPTY_STRING;
        const seriealizedCookie = `${this._name}=${this._value};${serializedExpires}${serializedMaxAge}` +
            `${serializedDomain}${serializedPath}${serializedSecure}${serializedHttpOnly}`;
        return seriealizedCookie.slice(-1) === ";" ? seriealizedCookie.slice(0, -1) : seriealizedCookie;
    }
}
export default Cookie;
//# sourceMappingURL=Cookie.js.map