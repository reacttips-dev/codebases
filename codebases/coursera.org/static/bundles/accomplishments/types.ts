export enum DistinctionLevel {
  NO_ACHIEVEMENT = 'NO_ACHIEVEMENT',
  NORMAL = 'NORMAL',
  DISTINCTION = 'DISTINCTION',
  HONORS = 'HONORS',
}

export type Partner = {
  name: string;
  logo: string;
};

export type Instructor = {
  firstName: string;
  lastName: string;
  photo: string;
  title: string;
};

export type CourseAccomplishment = {
  verifyCode: string;
  courseId: string;
  name: string;
  slug: string;
  completionDate: number;
  grade: number;
  distinctionLevel: DistinctionLevel;
  platformOrigin: CertificatePlatformOrigin;
  partners: Array<Partner>;
  instructors: Array<Instructor>;
};

export enum S12nProductVariant {
  NormalS12n = 'NormalS12n',
  ProfessionalCertificateS12n = 'ProfessionalCertificateS12n',
}

export type SpecializationAccomplishment = {
  verifyCode: string;
  specializationId: string;
  name: string;
  partnerNames: Array<string>;
  completionDate: number;
  productVariant: S12nProductVariant;
};

export type StatementOfAccomplishment = {
  v1SessionId: string;
};

export type CompletedCourseWithoutCertificate = {
  courseId: string;
  name: string;
  slug: string;
  distinctionLevel: DistinctionLevel;
  grade: number;
  statementOfAccomplishment?: StatementOfAccomplishment;
  platformOrigin: CertificatePlatformOrigin;
  partners: Array<Partner>;
  instructors: Array<Instructor>;
};

export enum CertificateType {
  Course = 'Course',
  Specialization = 'Specialization',
}

export enum CertificatePlatformOrigin {
  ON_DEMAND = 'ON_DEMAND',
  SPARK = 'SPARK',
}

export type Certificate = {
  // The SpecializationId or CourseId for this certificate
  certificateItemId: string;
  userId: string;
  verifyCode: string;
  grantedAt: number;
  certificateType: CertificateType;
  platformOrigin: CertificatePlatformOrigin;
};

export type Paging = {
  next?: string;
  total?: number;
};

export type PaginatedResult<T> = {
  paging: Paging;
  elements: Array<T>;
};
