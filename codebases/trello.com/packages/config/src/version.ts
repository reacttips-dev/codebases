// This library is intentionally crashy, rather than returning bad version compares

interface ClientVersion {
  minServerVersion: string;
  maxServerVersion: string;
}

export class Server {
  parts: number[];

  constructor(versionStr: string) {
    this.parts = [0];
    if (!versionStr) {
      return;
    }

    const parts = versionStr.split('.');
    if (parts.length > 0) {
      this.parts = parts.map((v) => parseInt(v, 10) || 0);
    }
  }

  toString() {
    return this.parts.join('.');
  }
  toJSON() {
    return this.toString();
  }

  lessThan(compareVersion: string) {
    const compare = this.compareTo(compareVersion);

    return compare !== null && compare < 0;
  }

  greaterThan(compareVersion: string) {
    const compare = this.compareTo(compareVersion);

    return compare !== null && compare > 0;
  }

  equalTo(compareVersion: string) {
    const compare = this.compareTo(compareVersion);

    return compare !== null && compare === 0;
  }

  // Returns the leftmost index (1-indexed) in which the versions differ,
  // counting from the right, or zero if they are equal. Positive if
  // first arg is greater, negative if second arg is greater.
  // 0.9.27.14 compared to 0.9.27.15 returns -1
  // 0.9.27 compared to 0.8.28 returns 2
  compareTo(versionStr: string | Server) {
    let compareVersion = versionStr;
    if (typeof compareVersion === 'string') {
      compareVersion = new Server(compareVersion);
    } else if (!(compareVersion instanceof Server)) {
      return null;
    }

    const len = Math.max(this.parts.length, compareVersion.parts.length);
    for (let i = len; i >= 0; i--) {
      const nA = this.parts[i] || 0;
      const nB = compareVersion.parts[i] || 0;
      if (nA > nB) {
        return len;
      }
      if (nB > nA) {
        return -len;
      }
    }

    return 0;
  }

  static compareStringVersions(vA: string, vB: string) {
    return new Server(vA).compareTo(vB);
  }

  supports(clientVersion: ClientVersion) {
    const min = clientVersion.minServerVersion;
    const max = clientVersion.maxServerVersion;

    return (!min || this.greaterThan(min)) && (!max || this.lessThan(max));
  }
}

// Essentially a client-side compatible wrapper for schema.Deployment
export class Client {
  head: string;
  patch: number = 0;
  version: number;
  constructor(versionStr: string) {
    const versionParts = versionStr.split('-');
    this.head = versionParts.slice(0, -1).join('-');
    this.version = parseInt(versionParts.slice(-1)[0], 10);
  }

  toString() {
    return `${this.head}-${this.fullVersion()}`;
  }
  toJSON() {
    return this.toString();
  }

  fullVersion() {
    // If @version is 0, the compact will eat it
    return [this.version, this.patch].filter((a) => a).join('.') || 0;
  }
}
