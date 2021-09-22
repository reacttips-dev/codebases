export type Course = {
  id: number;
  name: string;
  instructorIds: Array<number>;
  isVerificationEnabled: boolean;
};

export enum CourseCatalogType {
  PUBLIC = 'PUBLIC',
  ENTERPRISE = 'ENTERPRISE',
  PRIVATE = 'PRIVATE',
}
