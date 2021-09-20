type StringWithTrailingSlash = `${string}/`;

interface TrelloNetworkClientOptions {
  baseUrl?: StringWithTrailingSlash;
}

export class TrelloNetworkClient {
  #baseUrl: StringWithTrailingSlash;

  constructor(
    { baseUrl = '/' }: TrelloNetworkClientOptions = { baseUrl: '/' },
  ) {
    this.#baseUrl = baseUrl;
  }

  get baseUrl() {
    return this.#baseUrl;
  }

  getUrl(path: `/${string}`) {
    return `${this.#baseUrl}${path.substr(1)}`;
  }
}
