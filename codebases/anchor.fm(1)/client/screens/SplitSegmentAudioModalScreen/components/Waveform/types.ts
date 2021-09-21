export type Audio = {
  id: string;
  episodeWebId: string;
  duration: number;
  url: string;
  caption: string;
};

type UpdateParams = {
  start?: number;
  end?: number;
  nextSegment?: CustomSegment;
  prevSegment?: CustomSegment;
};

export type CustomSegment = {
  id: string;
  start: number;
  end: number;
  caption: string;
  nextSegment: CustomSegment;
  prevSegment: CustomSegment;
  toBeDeleted: string;
  update: (params: UpdateParams) => void;
};

export enum WaveformProcessingStatus {
  WAITING = 'waiting',
  PROCESSED = 'processed',
  FAILED = 'failed',
}
