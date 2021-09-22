class Cue {
  id: string;

  index: number;

  startTime: number;

  endTime: number;

  text: string;

  constructor(id: $TSFixMe, index: $TSFixMe, text: $TSFixMe, startTime: $TSFixMe, endTime: $TSFixMe) {
    this.id = id;
    this.index = index;
    this.startTime = startTime; // double, in seconds
    this.endTime = endTime; // double, in seconds

    this.text = text
      .replace('<br/>', ' ')
      .replace('\n', ' ')
      .replace(/^\.$/, '')
      .replace(/&#(\d+);/g, (match: $TSFixMe, character: $TSFixMe) => String.fromCharCode(character));
  }
}

export default Cue;
